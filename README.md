mmir-lib
========

Source Code for the MMIR (Mobile Multimodal Interaction and Rendering) library 

This is the mere source code of the library without any tooling etc.

Usually, the content of the root directory would be placed within the directory ```mmirf/```:

    ...
    /controllers/
    /mmirf/
    /models/
    /views/
    /index.html
    ...

of the application, that uses the MMIR framework (cf. the [StarterKit][1] example).

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
 * RequireJS
 * SCION
 * JS/CC
 * ANTLR 3
 * CryptoJS MD5

NOTE: Integration / loading of the Cordova is now designed to work with the _build process_
      of **Cordova 3** (see [MMIR skeleton project][2] for integration / tooling of the MMIR framework
      in combination with Cordova 3.

--
#### License

If not stated otherwise, all files and resources is provided under the MIT license


--
##### Version Information

 MMIR Version 3.0beta3


[1]: https://github.com/mmig/mmir-starter-kit
[2]: https://github.com/mmig/mmir-cordova

