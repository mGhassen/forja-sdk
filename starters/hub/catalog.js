// Starter HUB — kind: catalog
// Adds a shell tab (nav). Host calls extract(ctx) with ctx.action:
//   layout | rail | search | details
//
// Prelude: _kit.js (= SDK catalog-kit.js helpers: hubOk, hubItems, hubFail, …)
// Envelope schema: ../../schema/catalog-envelope.schema.json
// Guide: ../../DEVELOPING.md#catalog-hub-plugins-kind-catalog

// Static sample library so the tab works with zero API keys.
// Replace CATALOG + handlers with your upstream (TMDB, AniList, scrape, …).
var CATALOG = [
  {
    id: 'starter:550',
    type: 'movie',
    name: 'Fight Club',
    poster: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    background: 'https://image.tmdb.org/t/p/w1280/hZkgoQYus5vegGaobWLYDQR.jpg',
    description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club.',
    rating: 8.4,
    releaseInfo: '1999',
    genres: ['Drama'],
    ids: { tmdb: '550', imdb: 'tt0137523' },
    open: { surface: 'tmdb', id: '550', mediaType: 'movie' },
  },
  {
    id: 'starter:27205',
    type: 'movie',
    name: 'Inception',
    poster: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    background: 'https://image.tmdb.org/t/p/w1280/s3TBrRGB1NCvxz3bPdCLJHNyeJI.jpg',
    description: 'A thief who steals corporate secrets through dream-sharing technology is offered a chance at redemption.',
    rating: 8.4,
    releaseInfo: '2010',
    genres: ['Action', 'Science Fiction', 'Adventure'],
    ids: { tmdb: '27205', imdb: 'tt1375666' },
    open: { surface: 'tmdb', id: '27205', mediaType: 'movie' },
  },
  {
    id: 'starter:1396',
    type: 'tv',
    name: 'Breaking Bad',
    poster: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    background: 'https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
    description: 'A chemistry teacher diagnosed with cancer turns to manufacturing methamphetamine.',
    rating: 8.9,
    releaseInfo: '2008',
    genres: ['Drama', 'Crime'],
    ids: { tmdb: '1396', imdb: 'tt0903747' },
    open: { surface: 'tmdb', id: '1396', mediaType: 'tv' },
    videos: [
      { id: 's1e1', title: 'Pilot', season: 1, episode: 1, released: '1' },
      { id: 's1e2', title: 'Cat\'s in the Bag...', season: 1, episode: 2, released: '1' },
    ],
  },
  {
    id: 'starter:1399',
    type: 'tv',
    name: 'Game of Thrones',
    poster: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
    background: 'https://image.tmdb.org/t/p/w1280/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg',
    description: 'Nine noble families fight for control over the lands of Westeros.',
    rating: 8.4,
    releaseInfo: '2011',
    genres: ['Sci-Fi & Fantasy', 'Drama', 'Action & Adventure'],
    ids: { tmdb: '1399', imdb: 'tt0944947' },
    open: { surface: 'tmdb', id: '1399', mediaType: 'tv' },
  },
];

function byId(id) {
  var key = String(id || '');
  for (var i = 0; i < CATALOG.length; i++) {
    if (CATALOG[i].id === key) return CATALOG[i];
  }
  return null;
}

function railItems(railId) {
  var id = String(railId || 'featured');
  if (id === 'movies') {
    return CATALOG.filter(function (m) { return m.type === 'movie'; });
  }
  if (id === 'series') {
    return CATALOG.filter(function (m) { return m.type === 'tv'; });
  }
  // featured / spotlight / default — full list
  return CATALOG.slice();
}

function searchItems(query) {
  var q = String(query || '').trim().toLowerCase();
  if (!q) return CATALOG.slice();
  return CATALOG.filter(function (m) {
    if (String(m.name).toLowerCase().indexOf(q) >= 0) return true;
    var genres = m.genres || [];
    for (var i = 0; i < genres.length; i++) {
      if (String(genres[i]).toLowerCase().indexOf(q) >= 0) return true;
    }
    return false;
  });
}

function extract(ctx) {
  var action = hubAction(ctx);
  var params = hubParams(ctx);

  if (action === 'layout') {
    // Page widgets the host mounts. `rail` ids must match rail handler below.
    return Promise.resolve(
      hubOk('layout', {
        pages: {
          home: {
            widgets: [
              {
                type: 'hero',
                id: 'spotlight',
                rail: 'featured',
                bleed: 'featured',
              },
              {
                type: 'rail',
                id: 'featured',
                title: 'Featured',
                rail: 'featured',
              },
              {
                type: 'rail',
                id: 'movies',
                title: 'Movies',
                rail: 'movies',
              },
              {
                type: 'rail',
                id: 'series',
                title: 'Series',
                rail: 'series',
              },
            ],
          },
        },
      }, { maxAge: 3600, swr: 86400 }),
    );
  }

  if (action === 'rail') {
    var rail = String(params.rail || 'featured');
    return Promise.resolve(
      hubItems('rail', railItems(rail), { maxAge: 600, swr: 3600 }),
    );
  }

  if (action === 'search') {
    return Promise.resolve(
      hubItems('search', searchItems(params.query), { maxAge: 120 }),
    );
  }

  if (action === 'details') {
    var meta = byId(params.id);
    if (!meta) {
      return Promise.resolve(
        hubFail('details', 'NOT_FOUND', 'Unknown id: ' + params.id, false),
      );
    }
    // Host opens play/Sources via meta.open (surface + opaque id).
    return Promise.resolve(hubOk('details', { meta: meta }, { maxAge: 600 }));
  }

  return Promise.resolve(
    hubFail(action, 'INVALID_ACTION', 'Unsupported action: ' + action, false),
  );
}
