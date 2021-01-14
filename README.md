# AstraSolaris
Solar system virtual 3d model.

## Objetives
This project attempts to create a scientifically accurate model of the solar system that is as complete as possible.
The model contains a representation of the following lists of objects:

1. The Sun
2. Planets
3. Dwarf planets
3. Satellites (moons)
4. Minor bodies.
  a. Asteroids
  b. Comets
  c. Kuiper belt objects
  d. Meteoroids
5. Artificial satellites and probes.

In addition to these, other phenomena such as planetary magnetic fields, and nearby stars, will be modeled.

This repository contains two files for each of the categories shown, one with the ending run.csv and the other with the ending info.csv (eg dwarf_planets_run.csv and dwarf_planets_info.csv). The _run_ file contains the information necessary for the Astra Solaris graphics engine to be able to generate the object within the 3D model, while the _info_ file contains the information that will be shown to the users relative to that object.

The apps folder contains the source code of the functions used for specific purposes (simulation of physical effects, interpretation of special instructions, generation of reference geometry, etc.). More specific information about these functions will be found in wiki documents.

The on-line access to the main model can be found at www.astrasolaris.org/solarsystem
For more information you can visit www.astrasolaris.org



