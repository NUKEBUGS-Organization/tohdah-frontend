import { useLocation } from 'react-router-dom';
import { APP_SCREEN_CATALOG } from '../../app/catalog';
import { ScreenScaffold } from '../../components/ScreenScaffold';
import { APP_SCREEN_REGISTRY } from './screens/registry';

export function CatalogRoute() {
  const { pathname } = useLocation();
  const rel = pathname.replace(/^\/app\/?/, '').replace(/\/$/, '');
  const Specific = APP_SCREEN_REGISTRY[rel];
  if (Specific) {
    return <Specific />;
  }
  const meta = APP_SCREEN_CATALOG.find((c) => c.path === rel);
  return (
    <ScreenScaffold
      title={meta?.title ?? 'Screen'}
      description={
        meta?.description ??
        'This route is reserved in the catalog but has no screen component yet.'
      }
    />
  );
}
