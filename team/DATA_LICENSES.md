# Data and licenses
- Map shapes (team/world.js 1:110m, team/world-detail.js 1:50m subset for 8 countries): Natural Earth, public domain.
  Terms: https://www.naturalearthdata.com/about/terms-of-use/  ("All versions of Natural Earth raster + vector map data ... are in the public domain. You may use the maps in any manner, including modifying the content and design, electronic dissemination, and commercial use. Attribution is not required but is appreciated.")
  Source files: https://github.com/nvkelso/natural-earth-vector (geojson/ne_110m_admin_0_countries.geojson, ne_50m_admin_0_countries.geojson), coordinates rounded (1 decimal for 110m, 2 decimals for 50m).
  Credit: Made with Natural Earth.
- Questions (team/questions.js): original text written for this project. Fact checks in QUESTION_SOURCES.md. No questions, branding or assets copied from any other game site.
- Known limits: country borders are generalized; polygon holes (e.g. enclaves) are ignored; disputed borders follow Natural Earth's default view.
