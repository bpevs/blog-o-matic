const fs = require("fs");
const path = require("path");
const webpack = require("webpack");

const baseDir = path.resolve(__dirname, "..");

/* Inform webpack that our node modules are commonjs
======================================================================= */
const nodeModules = {};
fs.readdirSync(path.join(baseDir, "node_modules"))
  .filter(function(file) {
    return [".bin"].indexOf(file) === -1;
  })
  .forEach(function(module) {
    nodeModules[module] = "commonjs " + module;
  });

if(process.env["NODE_ENV"] === "development") {
  const sourceMapBanner = "require('source-map-support').install();";
  config.plugins = config.plugins.concat([
    new webpack.BannerPlugin(sourceMapBanner, {
      entryOnly: false, // Adds banner to every generated file
      raw: true // Prepend this text without making any changes
    })
  ]);
}

/* Set default resolution path to the same name as the folder
 * eg `app/components/Button` finds `app/components/Button/Button.js`
======================================================================= */
function DirectoryDefaultFilePlugin(files) {}

DirectoryDefaultFilePlugin.prototype.apply = function(resolver) {
  resolver.plugin("directory", function(req, done) {
    const directory = resolver.join(req.path, req.request);

    resolver.fileSystem.stat(directory, function(error, stat) {
      if (error || !stat) return done();
      if (!stat.isDirectory()) return done();
      if(Boolean(directory.match(/node_modules/))) return done();

      resolver.doResolve("file", {
        path: req.path,
        query: req.query,
        request: resolver.join(directory, path.basename(directory))
      }, function (error, result) {
        return done(undefined, result || undefined);
      });
    });
  });
};

/* Default Configuration
======================================================================= */
module.exports = {
  baseDir: baseDir, // Needed because our webpack files are in a folder
  entry: path.join(baseDir, "app/index.js"),
  output: {
    path: path.join(baseDir, "public", "build"),
    publicPath: "/build/",
    filename: "index.js"
  },

  resolve: {
    // Using this we can import `promisify`, rather than `promisify.js`
    extensions: ["", ".js"],

    // Shortcuts to folders.  We can start an import path from `app`, `test`, and `public`.
    alias: {
      app: path.join(baseDir, "app"),
      test: path.join(baseDir, "test"),
      public: path.join(baseDir, "public")
    }
  },

  module: {
    // Run ESLint before our application starts.
    preLoaders: [{ test: /.js$/, loader: "eslint", exclude: /node_modules/ }],

    // Loaders help us by telling webpack what and how we should compile
    loaders: [
      {
        test: /\.js$/,        // Find all files that end with `.js` and `.jsx`
        loader: "babel",        // Compile all of these with Babel
        exclude: /node_modules/ // `node_modules` should already be compiled
      }
    ]
  },

  plugins: [
    // Resolves files with the same name as the containing folder
    new webpack.ResolverPlugin([ new DirectoryDefaultFilePlugin() ])
  ],

  target: "node",
  externals: nodeModules,

  node: {
    __dirname: true,
    __filename: true
  },

  eslint: { configFile: path.join(baseDir, ".eslintrc.js") }
};
