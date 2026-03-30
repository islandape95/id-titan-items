// ============================================================
//  COMMUNITY VERSIONS LOADER
//  Fetches versions from the versions/ folder (via manifest.json)
//  and imports them into localStorage if not already present.
// ============================================================

(function () {
  const IMPORTED_KEY = 'community_versions_imported';

  fetch('versions/manifest.json')
    .then(r => r.ok ? r.json() : [])
    .then(files => {
      if (!files.length) return;

      const already = JSON.parse(localStorage.getItem(IMPORTED_KEY) || '[]');
      const toLoad = files.filter(f => !already.includes(f));
      if (!toLoad.length) return;

      return Promise.all(
        toLoad.map(f =>
          fetch('versions/' + f)
            .then(r => r.ok ? r.json() : null)
            .catch(() => null)
        )
      ).then(results => {
        results.forEach((data, i) => {
          if (!data) return;
          try {
            const name = data.name || toLoad[i].replace('.json', '');
            const parentId = data.parentId || versions.BASE_ID;
            const v = versions.create(name, parentId);
            if (data.items) versions.saveItems(v.id, data.items);
            already.push(toLoad[i]);
          } catch (e) {
            console.warn('[Community] Failed to import', toLoad[i], e);
          }
        });
        localStorage.setItem(IMPORTED_KEY, JSON.stringify(already));
        console.log('[Community] Imported', toLoad.length, 'version(s)');
      });
    })
    .catch(() => { /* offline or no manifest — that's fine */ });
})();
