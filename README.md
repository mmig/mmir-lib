mmir-lib
========

https://github.com/mmig/mmir-lib


Source Code for the MMIR (Mobile Multimodal Interaction and Rendering) library 

This is the mere source code of the bare library (i.e. without any tooling etc.)

Usually, the content of this repository (of the root directory)
would be placed within the directory ```mmirf/``` of the web application:

    ...
    /controllers/
    /mmirf/
    /models/
    /views/
    /index.html
    ...

For examples, see the [StarterKit][1] or the [minimal Cordova example][2].

--
#### Including mmir-lib as subtree

This repository can be included as GIT _subtree_ so that updates can be easily fetched.
E.g. for including the repository as subtree in the directory ```www/mmirf``` the 
following command can be used:

    git subtree add --prefix www/mmirf https://github.com/mmig/mmir-lib master --squash

later updates from this repository can be fetched from within the referencing project using

    git subtree pull --prefix www/mmirf https://github.com/mmig/mmir-lib master --squash

--
#### Used Libraries

(see contents of ```/vendor/libs/```)

 * jQuery 1.11.1
 * jQuery Mobile 1.4.3
 * RequireJS 2.1.9
 * SCION
 * JS/CC 0.30
 * ANTLR 3
 * CryptoJS MD5 3.1.2



See also the [tools project][3] for scripts, resources etc. for compiling and generating resources
(e.g. for compiling JSON grammar files from the application's `config/languages/[language code]/`
directories into JavaScript files).

NOTE: Integration with / loading of Cordova is now designed to work with the _build process_
      of **Cordova 3** (see [MMIR skeleton project][2] for integration / tooling of the MMIR framework
      in combination with Cordova 3).

--
#### License

If not stated otherwise, all files and resources are provided under the MIT license


--
##### Version Information

 MMIR Version 3.0beta3


[1]: https://github.com/mmig/mmir-starter-kit
[2]: https://github.com/mmig/mmir-cordova
[3]: https://github.com/mmig/mmir-tooling

