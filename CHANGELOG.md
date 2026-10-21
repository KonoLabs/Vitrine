# Changelog

## [0.4.0] - 2026-10-21

### Added

- FieldCam section on the landing page with the interactive 3D board and a link to the case study.
- `FIELD CAM` entry in the top navigation.

### Changed

- The crosshair and coordinate readout stay visible during the loading animation, inverted to black-on-green.

## [0.3.1] - 2026-10-21

### Fixed

- Production installs failed because the pnpm lockfile was missing the new dependencies.

## [0.3.0] - 2026-10-21

### Added

- `/fieldcam` case study with an interactive 3D view of the FieldCam controller board.
- `npm run build:model` bakes the tscircuit circuit JSON into `static/models/fieldcam.glb`.
- FieldCam entry in the projects list.

### Changed

- three.js and the board model load lazily, only on `/fieldcam`.

## [0.2.0] - 2026-10-21

### Added

- Full-screen dithered loading animation on load: black Bayer serpent on green background homing into position with a top-to-bottom raster scan wipe.
- Click and Escape keyboard shortcuts to skip the intro sequence immediately.

### Changed

- Wrapped hero heading line with non-breaking span for `& FULL-STACK`.

## [0.1.0] - 2026-10-20

### Added

- Dedicated Fusible section on the home page (`04 // OPEN SOURCE`): pitch, spec bullets, terminal quick-start, and GitHub CTA.
- `04.FUSIBLE` entry in the top navigation.

### Changed

- Contact section renumbered from `04` to `05`.

### Removed

- Inline Fusible mention at the bottom of the Capabilities section.
