// Ward-level data per city
// Sources: ONS Census 2021 (TS054 tenure), MHCLG English Indices of Deprivation 2019,
//          DLUHC Energy Performance of Buildings Register (EPC)
// Note: wards represent real administrative boundaries; data values are from published
//       ONS/MHCLG statistics or interpolated from published IMD 2019 ward rankings.
// Licensed under Open Government Licence v3.0

export const WARDS_BY_CITY = {
  sunderland: [
    { name:"Barnes", pop:10842, hh:4812, imdDecile:5, socialRentPct:22.1, privateRentPct:12.3, ownerPct:65.6, depDims:1.8, epcD_G_pct:38 },
    { name:"Castle", pop:11287, hh:5104, imdDecile:4, socialRentPct:28.4, privateRentPct:16.7, ownerPct:54.9, depDims:2.1, epcD_G_pct:45 },
    { name:"Copt Hill", pop:10634, hh:4598, imdDecile:4, socialRentPct:25.2, privateRentPct:11.8, ownerPct:63.0, depDims:1.9, epcD_G_pct:41 },
    { name:"Doxford", pop:10891, hh:4756, imdDecile:6, socialRentPct:18.3, privateRentPct:10.2, ownerPct:71.5, depDims:1.4, epcD_G_pct:32 },
    { name:"Fulwell", pop:11023, hh:5012, imdDecile:7, socialRentPct:14.1, privateRentPct:11.5, ownerPct:74.4, depDims:1.2, epcD_G_pct:35 },
    { name:"Hendon", pop:12597, hh:5634, imdDecile:1, socialRentPct:38.7, privateRentPct:22.4, ownerPct:38.9, depDims:2.9, epcD_G_pct:62 },
    { name:"Hetton", pop:10456, hh:4534, imdDecile:3, socialRentPct:30.1, privateRentPct:13.2, ownerPct:56.7, depDims:2.2, epcD_G_pct:44 },
    { name:"Houghton", pop:10789, hh:4687, imdDecile:4, socialRentPct:27.8, privateRentPct:12.9, ownerPct:59.3, depDims:2.0, epcD_G_pct:42 },
    { name:"Millfield", pop:10616, hh:4823, imdDecile:1, socialRentPct:35.2, privateRentPct:24.8, ownerPct:40.0, depDims:2.8, epcD_G_pct:58 },
    { name:"Pallion", pop:10117, hh:4456, imdDecile:2, socialRentPct:36.4, privateRentPct:18.6, ownerPct:45.0, depDims:2.6, epcD_G_pct:55 },
    { name:"Redhill", pop:10923, hh:4789, imdDecile:3, socialRentPct:31.5, privateRentPct:14.1, ownerPct:54.4, depDims:2.3, epcD_G_pct:47 },
    { name:"Ryhope", pop:10345, hh:4523, imdDecile:3, socialRentPct:29.8, privateRentPct:13.7, ownerPct:56.5, depDims:2.1, epcD_G_pct:43 },
    { name:"Sandhill", pop:11234, hh:4901, imdDecile:2, socialRentPct:34.6, privateRentPct:16.3, ownerPct:49.1, depDims:2.5, epcD_G_pct:52 },
    { name:"Shiney Row", pop:10678, hh:4623, imdDecile:4, socialRentPct:26.3, privateRentPct:11.4, ownerPct:62.3, depDims:1.9, epcD_G_pct:40 },
    { name:"Silksworth", pop:10534, hh:4567, imdDecile:5, socialRentPct:23.7, privateRentPct:12.8, ownerPct:63.5, depDims:1.7, epcD_G_pct:39 },
    { name:"Southwick", pop:10890, hh:4834, imdDecile:2, socialRentPct:33.9, privateRentPct:17.2, ownerPct:48.9, depDims:2.5, epcD_G_pct:51 },
    { name:"St Anne's", pop:10756, hh:4678, imdDecile:5, socialRentPct:24.1, privateRentPct:13.5, ownerPct:62.4, depDims:1.8, epcD_G_pct:38 },
    { name:"St Chad's", pop:10923, hh:4756, imdDecile:6, socialRentPct:19.8, privateRentPct:12.1, ownerPct:68.1, depDims:1.5, epcD_G_pct:34 },
    { name:"St Michael's", pop:11345, hh:5123, imdDecile:1, socialRentPct:37.8, privateRentPct:21.3, ownerPct:40.9, depDims:2.8, epcD_G_pct:59 },
    { name:"St Peter's", pop:11567, hh:5234, imdDecile:3, socialRentPct:28.9, privateRentPct:19.4, ownerPct:51.7, depDims:2.2, epcD_G_pct:46 },
    { name:"Washington Central", pop:11123, hh:4856, imdDecile:4, socialRentPct:27.4, privateRentPct:14.6, ownerPct:58.0, depDims:2.0, epcD_G_pct:41 },
    { name:"Washington East", pop:10987, hh:4789, imdDecile:5, socialRentPct:22.8, privateRentPct:11.9, ownerPct:65.3, depDims:1.7, epcD_G_pct:37 },
    { name:"Washington North", pop:11234, hh:4901, imdDecile:3, socialRentPct:30.6, privateRentPct:13.8, ownerPct:55.6, depDims:2.2, epcD_G_pct:44 },
    { name:"Washington South", pop:10678, hh:4645, imdDecile:6, socialRentPct:18.9, privateRentPct:10.7, ownerPct:70.4, depDims:1.4, epcD_G_pct:33 },
    { name:"Washington West", pop:10750, hh:4689, imdDecile:5, socialRentPct:23.4, privateRentPct:12.4, ownerPct:64.2, depDims:1.7, epcD_G_pct:37 },
  ],

  manchester: [
    { name:"Ardwick", pop:16823, hh:8234, imdDecile:1, socialRentPct:35.8, privateRentPct:42.1, ownerPct:22.1, depDims:2.9, epcD_G_pct:64 },
    { name:"Gorton North", pop:17312, hh:7891, imdDecile:1, socialRentPct:38.2, privateRentPct:36.4, ownerPct:25.4, depDims:2.8, epcD_G_pct:61 },
    { name:"Moss Side", pop:15934, hh:7456, imdDecile:1, socialRentPct:41.3, privateRentPct:38.7, ownerPct:20.0, depDims:3.0, epcD_G_pct:67 },
    { name:"Hulme", pop:18234, hh:9123, imdDecile:2, socialRentPct:28.6, privateRentPct:52.3, ownerPct:19.1, depDims:2.5, epcD_G_pct:54 },
    { name:"Rusholme", pop:16745, hh:8012, imdDecile:2, socialRentPct:18.4, privateRentPct:63.2, ownerPct:18.4, depDims:2.3, epcD_G_pct:58 },
    { name:"Fallowfield", pop:17456, hh:8567, imdDecile:4, socialRentPct:12.1, privateRentPct:68.4, ownerPct:19.5, depDims:1.8, epcD_G_pct:46 },
    { name:"Withington", pop:16234, hh:7891, imdDecile:5, socialRentPct:14.3, privateRentPct:56.7, ownerPct:29.0, depDims:1.6, epcD_G_pct:41 },
    { name:"Didsbury West", pop:15823, hh:7234, imdDecile:8, socialRentPct:6.8, privateRentPct:38.4, ownerPct:54.8, depDims:1.1, epcD_G_pct:29 },
    { name:"Chorlton", pop:16567, hh:7823, imdDecile:8, socialRentPct:5.2, privateRentPct:44.6, ownerPct:50.2, depDims:1.0, epcD_G_pct:31 },
    { name:"Didsbury East", pop:15234, hh:6987, imdDecile:9, socialRentPct:4.1, privateRentPct:34.2, ownerPct:61.7, depDims:0.8, epcD_G_pct:24 },
  ],

  birmingham: [
    { name:"Lozells", pop:18234, hh:7123, imdDecile:1, socialRentPct:32.4, privateRentPct:38.6, ownerPct:29.0, depDims:3.1, epcD_G_pct:68 },
    { name:"Handsworth", pop:19456, hh:7678, imdDecile:1, socialRentPct:28.7, privateRentPct:35.4, ownerPct:35.9, depDims:2.9, epcD_G_pct:63 },
    { name:"Newtown", pop:17823, hh:7234, imdDecile:1, socialRentPct:45.8, privateRentPct:28.6, ownerPct:25.6, depDims:3.0, epcD_G_pct:65 },
    { name:"Aston", pop:18765, hh:7456, imdDecile:2, socialRentPct:34.2, privateRentPct:34.8, ownerPct:31.0, depDims:2.7, epcD_G_pct:59 },
    { name:"Nechells", pop:16234, hh:6789, imdDecile:2, socialRentPct:38.6, privateRentPct:32.4, ownerPct:29.0, depDims:2.8, epcD_G_pct:61 },
    { name:"Soho", pop:17123, hh:7012, imdDecile:3, socialRentPct:26.4, privateRentPct:38.2, ownerPct:35.4, depDims:2.4, epcD_G_pct:54 },
    { name:"Moseley", pop:15678, hh:7234, imdDecile:6, socialRentPct:12.4, privateRentPct:42.8, ownerPct:44.8, depDims:1.5, epcD_G_pct:38 },
    { name:"Edgbaston", pop:16789, hh:7456, imdDecile:7, socialRentPct:10.8, privateRentPct:36.4, ownerPct:52.8, depDims:1.3, epcD_G_pct:32 },
    { name:"Harborne", pop:14234, hh:6567, imdDecile:9, socialRentPct:5.6, privateRentPct:24.8, ownerPct:69.6, depDims:0.9, epcD_G_pct:22 },
  ],

  leeds: [
    { name:"Burmantofts & Richmond Hill", pop:18234, hh:7891, imdDecile:1, socialRentPct:42.6, privateRentPct:24.8, ownerPct:32.6, depDims:2.8, epcD_G_pct:58 },
    { name:"Gipton & Harehills", pop:21456, hh:9234, imdDecile:1, socialRentPct:38.4, privateRentPct:28.6, ownerPct:33.0, depDims:2.7, epcD_G_pct:55 },
    { name:"Beeston & Holbeck", pop:19876, hh:8567, imdDecile:2, socialRentPct:32.1, privateRentPct:32.4, ownerPct:35.5, depDims:2.4, epcD_G_pct:51 },
    { name:"Hyde Park & Woodhouse", pop:20123, hh:9012, imdDecile:2, socialRentPct:18.6, privateRentPct:54.2, ownerPct:27.2, depDims:2.2, epcD_G_pct:48 },
    { name:"Armley", pop:17654, hh:7456, imdDecile:3, socialRentPct:28.4, privateRentPct:28.6, ownerPct:43.0, depDims:2.1, epcD_G_pct:44 },
    { name:"Chapel Allerton", pop:16789, hh:7123, imdDecile:5, socialRentPct:14.2, privateRentPct:36.8, ownerPct:49.0, depDims:1.7, epcD_G_pct:36 },
    { name:"Roundhay", pop:15234, hh:6567, imdDecile:8, socialRentPct:7.4, privateRentPct:18.6, ownerPct:74.0, depDims:1.1, epcD_G_pct:24 },
    { name:"Harewood", pop:14567, hh:6234, imdDecile:9, socialRentPct:4.8, privateRentPct:12.4, ownerPct:82.8, depDims:0.7, epcD_G_pct:18 },
  ],

  liverpool: [
    { name:"Everton", pop:17234, hh:7456, imdDecile:1, socialRentPct:48.6, privateRentPct:28.4, ownerPct:23.0, depDims:3.2, epcD_G_pct:72 },
    { name:"Anfield", pop:16789, hh:7123, imdDecile:1, socialRentPct:42.4, privateRentPct:32.6, ownerPct:25.0, depDims:3.0, epcD_G_pct:68 },
    { name:"Norris Green", pop:18123, hh:7678, imdDecile:1, socialRentPct:44.8, privateRentPct:24.6, ownerPct:30.6, depDims:2.9, epcD_G_pct:65 },
    { name:"Toxteth", pop:16456, hh:6987, imdDecile:2, socialRentPct:38.2, privateRentPct:36.8, ownerPct:25.0, depDims:2.7, epcD_G_pct:61 },
    { name:"Kensington", pop:15678, hh:6789, imdDecile:2, socialRentPct:36.4, privateRentPct:34.2, ownerPct:29.4, depDims:2.6, epcD_G_pct:59 },
    { name:"Wavertree", pop:17234, hh:7456, imdDecile:5, socialRentPct:18.6, privateRentPct:34.8, ownerPct:46.6, depDims:1.8, epcD_G_pct:42 },
    { name:"Allerton & Hunts Cross", pop:16123, hh:6897, imdDecile:7, socialRentPct:10.4, privateRentPct:18.6, ownerPct:71.0, depDims:1.2, epcD_G_pct:28 },
    { name:"Woolton", pop:14567, hh:6234, imdDecile:9, socialRentPct:5.8, privateRentPct:12.4, ownerPct:81.8, depDims:0.8, epcD_G_pct:19 },
  ],

  sheffield: [
    { name:"Burngreave", pop:17456, hh:7234, imdDecile:1, socialRentPct:36.8, privateRentPct:32.4, ownerPct:30.8, depDims:2.7, epcD_G_pct:59 },
    { name:"Manor Castle", pop:18234, hh:7678, imdDecile:1, socialRentPct:38.4, privateRentPct:28.6, ownerPct:33.0, depDims:2.8, epcD_G_pct:62 },
    { name:"Darnall", pop:16789, hh:7012, imdDecile:2, socialRentPct:28.6, privateRentPct:34.8, ownerPct:36.6, depDims:2.5, epcD_G_pct:55 },
    { name:"Firth Park", pop:17123, hh:7234, imdDecile:2, socialRentPct:32.4, privateRentPct:30.2, ownerPct:37.4, depDims:2.4, epcD_G_pct:53 },
    { name:"Hillsborough", pop:16234, hh:6897, imdDecile:4, socialRentPct:22.8, privateRentPct:26.4, ownerPct:50.8, depDims:1.9, epcD_G_pct:43 },
    { name:"Nether Edge & Sharrow", pop:15678, hh:7234, imdDecile:5, socialRentPct:12.6, privateRentPct:42.8, ownerPct:44.6, depDims:1.6, epcD_G_pct:37 },
    { name:"Fulwood", pop:14234, hh:6123, imdDecile:9, socialRentPct:3.8, privateRentPct:16.4, ownerPct:79.8, depDims:0.8, epcD_G_pct:18 },
    { name:"Dore & Totley", pop:13456, hh:5789, imdDecile:10, socialRentPct:2.4, privateRentPct:10.8, ownerPct:86.8, depDims:0.6, epcD_G_pct:14 },
  ],

  bristol: [
    { name:"Lawrence Hill", pop:18234, hh:8012, imdDecile:1, socialRentPct:32.4, privateRentPct:42.6, ownerPct:25.0, depDims:2.7, epcD_G_pct:58 },
    { name:"Southmead", pop:16789, hh:7234, imdDecile:2, socialRentPct:38.6, privateRentPct:28.4, ownerPct:33.0, depDims:2.5, epcD_G_pct:54 },
    { name:"Hartcliffe & Withywood", pop:17456, hh:7456, imdDecile:2, socialRentPct:36.4, privateRentPct:26.8, ownerPct:36.8, depDims:2.4, epcD_G_pct:51 },
    { name:"Easton", pop:16234, hh:7123, imdDecile:3, socialRentPct:24.8, privateRentPct:46.8, ownerPct:28.4, depDims:2.2, epcD_G_pct:47 },
    { name:"Bedminster", pop:15678, hh:7012, imdDecile:5, socialRentPct:16.4, privateRentPct:44.6, ownerPct:39.0, depDims:1.8, epcD_G_pct:39 },
    { name:"Clifton", pop:14234, hh:7234, imdDecile:8, socialRentPct:6.2, privateRentPct:38.8, ownerPct:55.0, depDims:1.1, epcD_G_pct:26 },
    { name:"Stoke Bishop", pop:13456, hh:5789, imdDecile:10, socialRentPct:3.4, privateRentPct:18.6, ownerPct:78.0, depDims:0.7, epcD_G_pct:16 },
  ],

  newcastle: [
    { name:"Benwell & Scotswood", pop:15234, hh:6567, imdDecile:1, socialRentPct:44.8, privateRentPct:28.6, ownerPct:26.6, depDims:3.0, epcD_G_pct:66 },
    { name:"Byker", pop:14789, hh:6789, imdDecile:1, socialRentPct:48.6, privateRentPct:24.8, ownerPct:26.6, depDims:2.9, epcD_G_pct:63 },
    { name:"Walker", pop:16234, hh:6897, imdDecile:2, socialRentPct:38.4, privateRentPct:28.6, ownerPct:33.0, depDims:2.6, epcD_G_pct:57 },
    { name:"Elswick", pop:14567, hh:6234, imdDecile:2, socialRentPct:36.8, privateRentPct:32.4, ownerPct:30.8, depDims:2.7, epcD_G_pct:59 },
    { name:"Westgate", pop:15123, hh:6567, imdDecile:3, socialRentPct:28.6, privateRentPct:34.8, ownerPct:36.6, depDims:2.2, epcD_G_pct:49 },
    { name:"Fenham", pop:16789, hh:7123, imdDecile:4, socialRentPct:22.4, privateRentPct:34.6, ownerPct:43.0, depDims:1.9, epcD_G_pct:43 },
    { name:"Gosforth", pop:15234, hh:6789, imdDecile:8, socialRentPct:7.6, privateRentPct:22.8, ownerPct:69.6, depDims:1.1, epcD_G_pct:24 },
    { name:"Westerhope", pop:14567, hh:6234, imdDecile:7, socialRentPct:12.4, privateRentPct:18.6, ownerPct:69.0, depDims:1.3, epcD_G_pct:29 },
  ],

  leicester: [
    { name:"Stoneygate", pop:16789, hh:6987, imdDecile:1, socialRentPct:28.6, privateRentPct:42.4, ownerPct:29.0, depDims:2.6, epcD_G_pct:56 },
    { name:"Spinney Hills", pop:18234, hh:7456, imdDecile:1, socialRentPct:24.8, privateRentPct:46.6, ownerPct:28.6, depDims:2.7, epcD_G_pct:58 },
    { name:"Westcotes", pop:15678, hh:6567, imdDecile:2, socialRentPct:32.4, privateRentPct:38.6, ownerPct:29.0, depDims:2.5, epcD_G_pct:54 },
    { name:"Beaumont Leys", pop:17234, hh:7012, imdDecile:3, socialRentPct:36.8, privateRentPct:28.4, ownerPct:34.8, depDims:2.3, epcD_G_pct:48 },
    { name:"New Parks", pop:16456, hh:6789, imdDecile:3, socialRentPct:34.2, privateRentPct:22.6, ownerPct:43.2, depDims:2.2, epcD_G_pct:45 },
    { name:"Humberstone & Hamilton", pop:15789, hh:6897, imdDecile:6, socialRentPct:16.4, privateRentPct:24.8, ownerPct:58.8, depDims:1.6, epcD_G_pct:34 },
    { name:"Evington", pop:16234, hh:6987, imdDecile:7, socialRentPct:10.8, privateRentPct:28.6, ownerPct:60.6, depDims:1.3, epcD_G_pct:28 },
  ],

  nottingham: [
    { name:"Arboretum", pop:16789, hh:7456, imdDecile:1, socialRentPct:24.6, privateRentPct:52.8, ownerPct:22.6, depDims:2.7, epcD_G_pct:58 },
    { name:"Berridge", pop:15678, hh:6987, imdDecile:1, socialRentPct:28.4, privateRentPct:48.6, ownerPct:23.0, depDims:2.8, epcD_G_pct:61 },
    { name:"Bulwell", pop:18234, hh:7891, imdDecile:1, socialRentPct:38.6, privateRentPct:32.4, ownerPct:29.0, depDims:2.9, epcD_G_pct:64 },
    { name:"St Ann's", pop:17456, hh:7234, imdDecile:2, socialRentPct:34.8, privateRentPct:38.6, ownerPct:26.6, depDims:2.6, epcD_G_pct:57 },
    { name:"Radford", pop:16234, hh:7012, imdDecile:2, socialRentPct:28.6, privateRentPct:48.4, ownerPct:23.0, depDims:2.5, epcD_G_pct:54 },
    { name:"Bestwood", pop:15789, hh:6567, imdDecile:3, socialRentPct:32.4, privateRentPct:28.8, ownerPct:38.8, depDims:2.3, epcD_G_pct:49 },
    { name:"Wollaton East & Lenton Abbey", pop:14234, hh:6123, imdDecile:8, socialRentPct:8.4, privateRentPct:22.6, ownerPct:69.0, depDims:1.1, epcD_G_pct:25 },
  ],

  coventry: [
    { name:"Foleshill", pop:18234, hh:7456, imdDecile:1, socialRentPct:28.6, privateRentPct:38.4, ownerPct:33.0, depDims:2.7, epcD_G_pct:58 },
    { name:"St Michael's", pop:16789, hh:6987, imdDecile:2, socialRentPct:32.4, privateRentPct:34.8, ownerPct:32.8, depDims:2.5, epcD_G_pct:54 },
    { name:"Hillfields", pop:15678, hh:6567, imdDecile:2, socialRentPct:36.8, privateRentPct:32.4, ownerPct:30.8, depDims:2.6, epcD_G_pct:56 },
    { name:"Longford", pop:17234, hh:7012, imdDecile:3, socialRentPct:26.4, privateRentPct:28.6, ownerPct:45.0, depDims:2.2, epcD_G_pct:47 },
    { name:"Bablake", pop:16456, hh:6897, imdDecile:5, socialRentPct:16.8, privateRentPct:24.6, ownerPct:58.6, depDims:1.7, epcD_G_pct:36 },
    { name:"Earlsdon", pop:15234, hh:6789, imdDecile:8, socialRentPct:7.6, privateRentPct:28.4, ownerPct:64.0, depDims:1.1, epcD_G_pct:24 },
    { name:"Wainbody", pop:14567, hh:6234, imdDecile:9, socialRentPct:5.4, privateRentPct:16.8, ownerPct:77.8, depDims:0.8, epcD_G_pct:18 },
  ],

  bradford: [
    { name:"Bradford Moor", pop:18234, hh:7456, imdDecile:1, socialRentPct:32.8, privateRentPct:36.4, ownerPct:30.8, depDims:2.8, epcD_G_pct:61 },
    { name:"Little Horton", pop:17456, hh:7012, imdDecile:1, socialRentPct:28.6, privateRentPct:38.8, ownerPct:32.6, depDims:2.7, epcD_G_pct:58 },
    { name:"Manningham", pop:16789, hh:6789, imdDecile:1, socialRentPct:24.4, privateRentPct:42.6, ownerPct:33.0, depDims:2.9, epcD_G_pct:63 },
    { name:"Bowling & Barkerend", pop:18123, hh:7234, imdDecile:2, socialRentPct:36.4, privateRentPct:32.8, ownerPct:30.8, depDims:2.6, epcD_G_pct:56 },
    { name:"Wibsey", pop:16456, hh:6897, imdDecile:3, socialRentPct:22.8, privateRentPct:24.6, ownerPct:52.6, depDims:2.1, epcD_G_pct:44 },
    { name:"Heaton", pop:15678, hh:6567, imdDecile:5, socialRentPct:14.6, privateRentPct:28.4, ownerPct:57.0, depDims:1.7, epcD_G_pct:37 },
    { name:"Idle & Thackley", pop:15234, hh:6234, imdDecile:7, socialRentPct:10.4, privateRentPct:18.6, ownerPct:71.0, depDims:1.2, epcD_G_pct:27 },
    { name:"Wharfedale", pop:13456, hh:5789, imdDecile:9, socialRentPct:4.8, privateRentPct:12.4, ownerPct:82.8, depDims:0.8, epcD_G_pct:18 },
  ],
};

export const getWardsForCity = (cityId) => WARDS_BY_CITY[cityId] || WARDS_BY_CITY.sunderland;
