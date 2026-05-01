---
layout: home

hero:
  name: Zarr
  text: Chunked, compressed, N-dimensional arrays
  tagline: An open, community-driven format for storing large arrays in any key-value store, including cloud object storage.
  image:
    src: /images/zarr-hero.gif
    alt: Animated ECMWF temperature forecast rendered from a Zarr store, credit Development Seed (deck.gl-raster)
  actions:
    - theme: brand
      text: Implementations
      link: /implementations
    - theme: alt
      text: Specification
      link: https://zarr-specs.readthedocs.io/
    - theme: alt
      text: Share on Bluesky
      link: https://bsky.app/intent/compose?text=@zarr.dev%20%23beautifuldata

features:
  - title: Implementations
    details: Zarr libraries in Python, C, C++, Rust, JavaScript, Java, Julia, and more.
    link: /implementations
  - title: Conventions
    details: Domain conventions like OME-Zarr, GeoZarr, and Anndata layered on top of Zarr.
    link: /conventions
  - title: Community
    details: Office hours, ZEPs, community calls, and chat. Everyone is welcome.
    link: /community
  - title: Datasets
    details: Public Zarr datasets across climate, bio-imaging, genomics, and more.
    link: /datasets
---

## Description

Zarr is motivated by the need for a simple, transparent, open, and community-driven format that supports high-throughput distributed I/O on different storage systems. Zarr data can be stored in any storage system that can be represented as a key-value store, including most commonly POSIX file systems and cloud object storage but also zip files as well as relational and document databases.

See the following GitHub repositories for more information:

- [Zarr Python](https://github.com/zarr-developers/zarr)
- [Zarr Specs](https://github.com/zarr-developers/zarr-specs)
- [Numcodecs](https://github.com/zarr-developers/numcodecs)
- [Z5](https://github.com/constantinpape/z5)
- [N5](https://github.com/saalfeldlab/n5)
- [Zarr.jl](https://github.com/JuliaIO/Zarr.jl)
- [ndarray.scala](https://github.com/lasersonlab/ndarray.scala)

## Applications

- Simple and fast serialization of NumPy-like arrays, accessible from languages including Python, C, C++, Rust, Javascript, Java and Julia
- Multi-scale n-dimensional image storage, e.g. in light and electron microscopy
- Geospatial rasters, e.g. following the NetCDF / CF metadata conventions

## Features

- Chunk multi-dimensional arrays along any dimension.
- Store arrays in memory, on disk, inside a Zip file, on S3, etc.
- Read and write arrays concurrently from multiple threads or processes.
- Organize arrays into hierarchies via annotatable groups.

## Sponsorship

Zarr is a Sponsored Project of NumFOCUS, a US 501(c)(3) public charity.

NumFOCUS Sponsored Projects rely on the generous support of corporate sponsors, institutional partners, and individual donors.

## Videos

[Videos](https://www.youtube.com/playlist?list=PLvkeNUPrCU04Xvcph4ErxsRkZq28Oucr7) of community members talking about Zarr. If you have a video you'd like us to share, let us know!

<iframe width="640" height="480" src="https://www.youtube.com/embed/videoseries?list=PLvkeNUPrCU04Xvcph4ErxsRkZq28Oucr7" frameborder="0" allowfullscreen></iframe>

## Acknowledgements

Hero animation adapted from [`dynamical-zarr-ecmwf`](https://github.com/developmentseed/deck.gl-raster/tree/main/examples/dynamical-zarr-ecmwf) in [developmentseed/deck.gl-raster](https://github.com/developmentseed/deck.gl-raster)
