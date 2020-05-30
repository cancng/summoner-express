import express from "express";
import { Constants, LolApi } from "twisted";

const api = new LolApi();

const router = express.Router();

const regionFix = (regionPrefix) => {
  switch (regionPrefix) {
    case "tr":
      regionPrefix = Constants.Regions.TURKEY;
      break;
    case "euw":
      regionPrefix = Constants.Regions.EU_WEST;
      break;
    case "eune":
      regionPrefix = Constants.Regions.EU_EAST;
      break;
    case "na":
      regionPrefix = Constants.Regions.AMERICA_NORTH;
      break;
    default:
      regionPrefix = null;
      break;
  }
  return regionPrefix;
};

const getSummonerByName = async (summonerName, region) => {
  return await api.Summoner.getByName(summonerName, regionFix(region));
};

router.get("/:summonerName/:region", (req, res) => {
  getSummonerByName(req.params.summonerName, req.params.region)
    .then((r) => {
      res.json({ summoner: r.response, sCode: 200 });
    })
    .catch((e) => res.json({ message: e, sCode: 404 }));
});
router.get("/:summonerName/:region/matches", (req, res) => {
  async function matchList() {
    const user = await getSummonerByName(
      req.params.summonerName,
      req.params.region
    );
    const matches = await api.Match.list(
      user.response.accountId,
      regionFix(req.params.region)
    );
    return matches;
  }
  matchList()
    .then((r) => {
      res.json({ matches: r.response.matches.slice(0, 20), sCode: 200 });
    })
    .catch((err) => res.json({ message: err.body, sCode: 404 }));
});
router.get("/match/:matchId/:region", (req, res) => {
  async function matchExample() {
    const match = await api.Match.get(
      req.params.matchId,
      regionFix(req.params.region)
    );
    return match;
  }
  matchExample()
    .then((r) => res.json({ match: r.response, sCode: 200 }))
    .catch((err) => res.json({ message: err, sCode: 404 }));
});

export default router;
