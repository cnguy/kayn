# Task List
~ = in progress
- [ ] Add self-adjusting limits? I feel like I can just hotfix this on demand though or user can add method limits on their own.
- [ ] Add header validation on first request of each rate limiter. ~
- [x] Allow users to ignore timeout-related issues (greater than 500 requests generally). (set timeout)
- [ x Change `champListData` and `runeListData` style query params to `tags`.
- [x] Right now, passing incorrect options (query params) doesn't throw any errors. Adding this feature would help reduce incomplete data from typos.
- [x] Make promises retry more flexible (users can pass in time before retry, how many times they want it to keep going).
- [x] ~~Comment my code extensively..~~ This is okay for now. :)
- [ ] Fix highly inefficient tests. ~
- [ ] Add extensive tests that cover important functionality such as rate limiting and options. Not sure how I should test this right now though. ~
- [x] Add an [option to space out requests](https://github.com/ChauTNguyen/kindred-api/wiki/Rate-Limiter). ~~Maybe I should make this the default though (should still provide flexibility to users)~~.
- [x] Add tests (that handle parameters, errors, then the API itself). Make sure I add callback printing tests too! (90% coverage!!! obviously isn't indicative of a good suite, but this is a good starting point)
- [ ] Add the rest of the list, by.id, by.name, by.account functions. ~
- [ ] Refactor code to make lib more performant. ~
- [x] [Fix 404 Promise issues](https://github.com/ChauTNguyen/kindred-api/commit/3fd4ac7ac04aa3a992098b22e987807f170efcc6)
- [ ] Make error classes.
- [ ] Make more constants such as Resending promise req, Resending callback req, errors, etc.