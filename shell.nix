with import <nixpkgs> {};
  stdenv.mkDerivation {
    name = "cysync";
    buildInputs = [
      nodejs_20
      nodePackages.pnpm
      python310
      nodePackages.node-gyp
      libusb1
      udev
      rpm
      dpkg
      fakeroot
    ];
    LD_LIBRARY_PATH = lib.makeLibraryPath [
      libusb1
      glib
      nss
      nspr
      at-spi2-atk
      cups
      dbus
      libdrm
      gtk3
      pango
      cairo
      xorg.libX11
      xorg.libXcomposite
      xorg.libXdamage
      xorg.libXext
      xorg.libXfixes
      xorg.libXrandr
      xorg.libxcb
      mesa
      expat
      libxkbcommon
      alsa-lib
    ];
  }
