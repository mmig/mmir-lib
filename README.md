mmir-lib
========

https://github.com/mmig/mmir-lib


Source Code for the MMIR (Mobile Multimodal Interaction and Rendering) library

The MMIR framework provides means to created _minimal_ (client-based)
_dialog systems_ for multimodal interactions:

 * state-based interaction handling using SCXML (e.g. for touch/click, speech, gesture interactions)
 * support and plugins for several speech input (Automatic Speech Recognition, ASR) engines
 * support and plugins for several speech output/synthesis (Text To Speech, TTS) engines
 * support for client- or sever-based NLU processing
   * built-in support for grammars (similar BNF grammars that parse input as _tokens_ and _utterances_)

A reduced API _MarkDown_ documentation is available at [/docs][6]
([HTML API documentation][7], and further details at [github.com/mmig/mmir][5]).

For examples, see the [mmir-starter-simple][1] or [mmir-starter-ionic][2].

--
# Usage

## Building Resources (Grammars etc)

 * Prerequesites: Node.js

Some resources (e.g. grammars) need to be build/compiled, before they can be used.

This is supported e.g. via the [mmir-tooling][3] project.

In addition, the [mmir-wepack][4] integration, provides a further automated way
for including `mmir` in webpack-based apps / build applications.

## Web Page

 * include `/lib` as directory `/mmirf` in your web resources directory (e.g. `/www/mmirf`)

 * load/include `mmir` in HTML page
   ```html
   <!-- OPTIONAL helper script: auto-detect Cordova-environment and load its library if necessary: -->
   <script type="text/javascript" src="mmirf/tools/initCordova.js"></script>

   <!-- load the framework's core/base object -->
   <script type="text/javascript" src="mmirf/core.js"></script>

   <!-- OPTIONAL configure mmir framework before loading-->
   <script type="text/javascript" src="appjs/preinit.js"></script>

	 <!-- load mmir library -->
   <script type="text/javascript" src="mmirf/vendor/libs/require.min.js" data-main="mmirf/mainConfig" ></script>
   ```
 * use `mmir` after it's been initialized
   ```javascript
	 mmir.ready(function(){
		 ...
	 })
	 ```

## Node

```javascript
var mmir = require('mmir-lib');
mmir.ready(function(){
  ...
})
```


--
#### Used Libraries

(see contents of `/vendor/libs/`)

 * RequireJS 2.3.6  
	 (BSD or MIT; Copyright jQuery Foundation and other contributors)
 * SCION v1, @scion-scxml/core v2.6.22 (custom build)  
	 (LGPLv3, Apache License v2.0; Copyright 2018 Jacobean Research and Development, LLC)
 * JS/CC 0.30  
	 (BSD; Copyright © 2007-2016 by Phorward Software Technologies; Jan Max Meyer; Brobston Development, Inc.; and other contributors)
 * PEG.js 0.10.0  
	 (MIT; Copyright (c) 2010-2016 David Majda, Copyright (c) 2017+ Futago-za Ryuu)
 * Jison 0.4.15  
	 (MIT; Copyright (c) 2009-2014 Zachary Carter)
 * ANTLR 3  
	 (BSD; Copyright (c) 2013 Terence Parr)
 * crypto-js MD5 3.1.9-1 (custom build)  
	 (MIT; Copyright (c) 2009-2013 Jeff Mott, Copyright (c) 2013-2016 Evan Vosberg)
 * stacktrace-js 2.0.0  
	 (MIT; Copyright (c) 2017 Eric Wendelin and other contributors)


See also the [tools project][3] for scripts, resources etc. for compiling and generating resources
(e.g. for compiling JSON grammar files from the application's `config/languages/[language code]/`
directories into JavaScript files).

NOTE: Integration with / loading of Cordova is now designed to work with the _build process_
      of **Cordova 5** or later (see [MMIR skeleton project][2] for integration / tooling of the MMIR framework
      in combination with Cordova 5 and later versions).

--
#### License

If not stated otherwise, all files and resources are provided under the MIT license

[1]: https://github.com/mmig/mmir-starter-simple
[2]: https://github.com/mmig/mmir-starter-ionic
[3]: https://github.com/mmig/mmir-tooling
[4]: https://github.com/mmig/mmir-webpack
[5]: https://github.com/mmig/mmir
[6]: https://github.com/mmig/mmir-lib/tree/master/docs/
[7]: https://mmig.github.io/mmir/api/
[8]: https://github.com/mmig/mmir-starter-cordova
