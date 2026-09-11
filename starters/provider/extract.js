// Starter PROVIDER — kind: http
// Appears in Sources on movie / TV details. Does NOT add a shell tab.
//
// Host calls extract(ctx). Return Promise<stream[]> or []. Empty = no rows (ok).
// Stream schema: ../../schema/vod-stream.schema.json
// Guide: ../../DEVELOPING.md#vod-extract-plugins-kind-http

function extract(ctx) {
  var cfg = Object.assign({}, ctx.config || {});
  var type = String(ctx.type || ''); // 'movie' | 'tv'
  var tmdbId = ctx.tmdbId != null ? String(ctx.tmdbId).trim() : '';
  var imdbId = ctx.imdbId != null ? String(ctx.imdbId).trim() : '';
  var season = Number(ctx.season) || 0;
  var episode = Number(ctx.episode) || 0;
  var title = ctx.title != null ? String(ctx.title) : '';

  if (type !== 'movie' && type !== 'tv') return Promise.resolve([]);
  if (!tmdbId && !imdbId) return Promise.resolve([]);

  // --- Replace this block with your upstream ---
  //
  // var path = type === 'movie'
  //   ? '/movie/' + tmdbId
  //   : '/tv/' + tmdbId + '/' + season + '/' + episode;
  // var url = String(cfg.apiBase || '').replace(/\/$/, '') + path;
  //
  // return ctx.fetch(url, {
  //   headers: {
  //     Accept: 'application/json',
  //     Referer: (cfg.origin || '') + '/',
  //     Origin: cfg.origin || '',
  //   },
  // }).then(function (res) {
  //   if (!res || !res.ok) return [];
  //   return res.json();
  // }).then(function (json) {
  //   return mapStreams(json, cfg);
  // }).catch(function (err) {
  //   if (ctx.error) ctx.error(String(err && err.message ? err.message : err));
  //   return [];
  // });

  if (ctx.log) {
    ctx.log(
      'starter-vod: replace extract.js — tmdb=' +
        tmdbId +
        ' type=' +
        type +
        (type === 'tv' ? ' S' + season + 'E' + episode : '') +
        (title ? ' title=' + title : ''),
    );
  }

  // Temporary: one labeled placeholder so you can confirm the plugin appears
  // in Sources. Delete this return once mapStreams hits a real CDN.
  return Promise.resolve([
    {
      url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      name: 'Starter',
      title: 'REPLACE ME · ' + (type === 'tv' ? 'S' + season + 'E' + episode : 'movie') + ' · ' + tmdbId,
      quality: '720p',
      language: 'English',
      headers: {
        Referer: (cfg.origin || 'https://example.com') + '/',
      },
    },
  ]);
}

// Example mapper once you have upstream JSON:
// function mapStreams(json, cfg) {
//   var list = (json && json.streams) || [];
//   var out = [];
//   for (var i = 0; i < list.length; i++) {
//     var s = list[i];
//     var play = s.url || s.file;
//     if (!play) continue;
//     out.push({
//       url: play,
//       name: s.name || s.server || 'Server ' + (i + 1),
//       title: s.title || s.quality || '',
//       quality: s.quality || '',
//       language: s.language || '',
//       headers: {
//         Referer: (cfg.origin || '') + '/',
//         Origin: cfg.origin || '',
//       },
//     });
//   }
//   return out;
// }
//
// File-host embeds: return { url: embedPage } and let a hop plugin unwrap via
// ctx.hop(url). See DEVELOPING.md → Hop plugins.
