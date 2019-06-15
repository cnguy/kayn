`kayn` uses [Colorfulstan's RiotRateLimiter-node](https://github.com/colorfulstan/riotratelimiter-node) under the hood, but not exactly. I've created a [minor fork](https://github.com/cnguy/RiotRateLimiter-node) which does not deviate from the main library in any significant way. It allows me to add features that I think would be useful for `kayn`, such as `POST` functionality for the tournament endpoints.

Rate limiting functionality is thus the same as in `RiotRateLimiter-node`. `kayn` is simply a high-level library that uses the rate limiter under the hood.

Head back to the [README](https://github.com/cnguy/kayn/blob/master/README.md) for configuring rate limiting functionality.