import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export const VIEWS = [
  ['brief', 'Brief'],
  ['ask', 'Ask'],
  ['projects', 'Projects'],
  ['reports', 'Reports'],
  ['settings', 'Settings'],
];
const HASHED = ['brief', 'ask', 'projects', 'reports']; // views that are mirrored in the URL hash (Settings is not)

const Ctx = createContext(null);
export const useNav = () => useContext(Ctx);

export function NavProvider({ children }) {
  const [view, setView] = useState(() => {
    const start = (window.location.hash || '').slice(1);
    return HASHED.includes(start) ? start : 'brief';
  });
  const [curProject, setCurProject] = useState(null);
  const viewRef = useRef(view);
  viewRef.current = view;

  const go = useCallback((v) => {
    setView(v);
    if (HASHED.includes(v)) {
      try {
        window.history.replaceState(null, '', v);
      } catch {
        /* ignore */
      }
    }
    window.scrollTo({ top: 0 });
  }, []);

  const openProject = useCallback(
    (id) => {
      setCurProject(id);
      go('projects');
    },
    [go],
  );

  useEffect(() => {
    // reflect the starting view in the URL, then follow hash changes (back/forward, pasted links)
    try {
      window.history.replaceState(null, '', viewRef.current);
    } catch {
      /* ignore */
    }
    const onHash = () => {
      const v = window.location.hash.slice(1);
      if (HASHED.includes(v) && v !== viewRef.current) go(v);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [go]);

  const value = useMemo(
    () => ({ view, go, curProject, setCurProject, openProject }),
    [view, go, curProject, openProject],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
