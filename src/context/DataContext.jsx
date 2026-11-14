import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { API_BASE, api } from '../lib/api';
import { readStore, writeStore } from '../lib/format';
import { SRC } from '../data/sample';

const Ctx = createContext(null);
export const useData = () => useContext(Ctx);

const BLANK = { mode: null, done: null };
const fileUrl = (name) =>
  API_BASE + '/files/agreements/' + encodeURIComponent(name);

export function DataProvider({ children }) {
  const [data, setData] = useState(null);
  const [loadErr, setLoadErr] = useState(null);
  const [calcSeen, setCalcSeen] = useState(false);
  const [fstate, setFstate] = useState({}); // flag id -> {open, mode, touched, pending, err, done}
  const [fdef, setFdef] = useState(() => readStore('dx-fdef', {})); // flag type -> default action mode

  const load = useCallback(async (reload) => {
    try {
      const d = await api('/api/dashboard' + (reload ? '?reload=1' : ''));
      setData(d);
      setLoadErr(null);
      const st = {};
      for (const [id, s] of Object.entries(d.flag_states || {}))
        st[id] = { ...BLANK, done: s.done };
      setFstate(st);
    } catch (e) {
      setLoadErr(e.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);
  const reload = useCallback(() => {
    setData(null);
    setLoadErr(null);
    load(true);
  }, [load]);

  /* ---- sources: sample ones + the workbook and agreements once data has loaded ---- */
  const loadedAt = data?.loaded_at || '';
  const baseSources = useMemo(() => {
    const s = { ...SRC };
    if (data) {
      const S = data.sources;
      s.workbook = {
        k: 'excel',
        name: S.workbook.name,
        when:
          'Edited ' + S.workbook.modified + ' · loaded ' + S.workbook.loaded,
        group: 'Project data',
        url: API_BASE + '/files/workbook',
      };
      for (const a of S.agreements)
        s['doc:' + a.ref] = {
          k: 'word',
          name: a.name,
          when: 'Signed agreement',
          group: 'Project agreements',
          url: fileUrl(a.name),
        };
    }
    return s;
  }, [data]);
  const calcSource = useMemo(
    () => ({
      k: 'calc',
      name: 'Executive 360 calculations',
      when: 'Calculated ' + loadedAt,
      group: 'Project data',
    }),
    [loadedAt],
  );
  const sources = useMemo(
    () => (calcSeen ? { ...baseSources, calc: calcSource } : baseSources),
    [baseSources, calcSource, calcSeen],
  );
  const registerCalc = useCallback(() => setCalcSeen(true), []);

  /** API source -> citation (chip + preview) */
  const citeFrom = useCallback(
    (s) => {
      const pv = s.excerpt
        ? { t: 'quote', text: s.excerpt }
        : s.record && s.record.length
          ? { t: 'record', rows: s.record }
          : null;
      let S;
      if (s.kind === 'word')
        S = baseSources['doc:' + s.ref] || {
          k: 'word',
          name: s.name,
          when: 'Signed agreement',
          group: 'Project agreements',
          url: fileUrl(s.name),
        };
      else if (s.kind === 'calc') S = calcSource;
      else S = baseSources.workbook;
      return { S, loc: s.locator, used: s.used_for || '', pv };
    },
    [baseSources, calcSource],
  );

  const projects = useMemo(() => data?.projects || [], [data]);
  const flags = useMemo(
    () =>
      data
        ? data.flags.map((f) => ({ ...f, cites: f.sources.map(citeFrom) }))
        : [],
    [data, citeFrom],
  );
  const projById = useCallback(
    (id) => projects.find((p) => p.id === id),
    [projects],
  );

  /* ---- flag actions ---- */
  const patchFlag = useCallback(
    (id, patch) =>
      setFstate((s) => ({ ...s, [id]: { ...BLANK, ...s[id], ...patch } })),
    [],
  );
  const defaultFor = (f, def) =>
    def[f.type] && !(def[f.type] === 'auto' && !f.auto.allowed)
      ? def[f.type]
      : null;

  const flagApi = useMemo(
    () => ({
      open: (f) =>
        setFstate((s) => {
          const st = { ...BLANK, ...s[f.id], open: true };
          const d = defaultFor(f, fdef);
          if (st.mode === null && !st.touched && d) {
            st.mode = d;
            st.touched = true;
          } // apply the saved default the first time
          return { ...s, [f.id]: st };
        }),
      close: (f) => patchFlag(f.id, { open: false, mode: null, err: null }),
      toggleMode: (f, m, disabled) =>
        setFstate((s) => {
          const st = { ...BLANK, ...s[f.id], err: null };
          st.mode = disabled ? 'auto' : st.mode === m ? null : m; // a disabled "automatic" still opens, to explain why
          return { ...s, [f.id]: st };
        }),
      cancel: (f) => patchFlag(f.id, { mode: null, open: true, err: null }),
      run: async (f, action, extra = {}) => {
        patchFlag(f.id, { pending: true, err: null });
        try {
          const r = await api(`/api/flags/${encodeURIComponent(f.id)}/action`, {
            action,
            ...extra,
          });
          if (action === 'undo')
            patchFlag(f.id, {
              done: null,
              mode: null,
              open: true,
              pending: false,
            });
          else patchFlag(f.id, { done: r.state.done, pending: false });
        } catch (err) {
          patchFlag(f.id, { err: err.message, pending: false });
        }
      },
      setDefault: (f, checked) => {
        const mode = (fstate[f.id] || BLANK).mode;
        const next = { ...fdef };
        if (checked && mode) next[f.type] = mode;
        else delete next[f.type];
        setFdef(next);
        writeStore('dx-fdef', next);
        // other open flags of this type that have no action yet pick the new default up
        setFstate((s) => {
          const out = { ...s };
          for (const o of flags) {
            const st = s[o.id];
            const d = defaultFor(o, next);
            if (
              o.type === f.type &&
              st &&
              st.open &&
              st.mode === null &&
              !st.touched &&
              d
            )
              out[o.id] = { ...st, mode: d, touched: true };
          }
          return out;
        });
      },
    }),
    [fdef, fstate, flags, patchFlag],
  );

  const isDone = useCallback(
    (id) => !!(fstate[id] && fstate[id].done),
    [fstate],
  );
  const openFlagCount = useMemo(
    () => flags.filter((f) => !(fstate[f.id] && fstate[f.id].done)).length,
    [flags, fstate],
  );

  const value = useMemo(
    () => ({
      data,
      loadErr,
      loadedAt,
      reload,
      projects,
      projById,
      flags,
      sources,
      citeFrom,
      registerCalc,
      fstate,
      fdef,
      flagApi,
      isDone,
      openFlagCount,
    }),
    [
      data,
      loadErr,
      loadedAt,
      reload,
      projects,
      projById,
      flags,
      sources,
      citeFrom,
      registerCalc,
      fstate,
      fdef,
      flagApi,
      isDone,
      openFlagCount,
    ],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
