# TODO

1. Add log configuration to the config file. Use log config in lib/log.js.
2. Documentation
    - how to use logging
    - global.conf
    - global.dirs is custom for exponential
3. Convert Mongo to native driver
4. Create clean design pattern for controllers
5. Put Redis settings in config file
6. Do I really need Flash messages?
7. Document how to write and load middleware since this is per project. Currently,
   this is limited to "authorization" middleware, but I should make the code
   generic in both exponential/index.js and in project/middleware/*.
8. Clean up routers by not forcing auth and crsf into every router file!
9. Verify that 500, 404, and other error handling is working correctly
10. Add 404 error template to configuration conf.errors.notFound
11. Same as #10 but for 500 errors conf.errors.serverError
12. Use grunt for jshint + jscs
