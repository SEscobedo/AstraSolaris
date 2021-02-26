# AstraSolaris
![Node.js CI](https://github.com/SEscobedo/AstraSolaris/workflows/Node.js%20CI/badge.svg)
![GitHub](https://img.shields.io/github/license/SEscobedo/AstraSolaris)
[![Netlify Status](https://api.netlify.com/api/v1/badges/fb766ed0-27e1-4c4e-82bf-a0fd455113a6/deploy-status)](https://app.netlify.com/sites/astrasolaris/deploys)

_Open Source 3d modeling._

## Objetives
Astra Solaris is a set of software projects dedicated to astronomy and astronautics. All Astra Solaris projects are open source under MIT licence. The Institute of Astronomy and Meteorology of the University of Guadalajara is official partner and main scientific collaborator. You can contact us for participating in the development. Collaboration is NOT restricted to scientists and programmers.

View [code of conduct](.github/CODE_OF_CONDUCT.md)

## Main model: Astra Solar System
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

The js folder contains the source code of the functions used for specific purposes (simulation of physical effects, interpretation of special instructions, generation of reference geometry, etc.). More specific information about these functions will be found in wiki documents.

The on-line access to the main model can be found at www.astrasolaris.org/app/solarsystem
For more information you can visit www.astrasolaris.org





