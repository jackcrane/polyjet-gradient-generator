/*
	canvas-to-tiff version 1.0.0
	By Epistemex (c) 2015-2016
	www.epistemex.com
	MIT License (this header required)
*/
export var CanvasToTIFF = {
  _dly: 9,
  _error: null,
  setErrorHandler: function (a) {
    this._error = a;
  },
  toArrayBuffer: function (d, c, A) {
    A = A || {};
    var x = this;
    try {
      var I = d.width,
        q = d.height,
        y = 0,
        t = 258,
        k = 0,
        z = [],
        s,
        G =
          "\x63\x61\x6e\x76\x61\x73\x2d\x74\x6f\x2d\x74\x69\x66\x66\x20\x30\x2e\x34\0",
        v = !!A.littleEndian,
        g = +(A.dpiX || A.dpi || 96) | 0,
        i = +(A.dpiY || A.dpi || 96) | 0,
        r = d.getContext("2d").getImageData(0, 0, I, q),
        u = r.data.length,
        o = t + u,
        m = new ArrayBuffer(o),
        n = new Uint8Array(m),
        H = new DataView(m),
        C = 0,
        e = new Date(),
        f;
      D(v ? 18761 : 19789);
      D(42);
      E(8);
      b();
      a(254, 4, 1, 0);
      a(256, 4, 1, I);
      a(257, 4, 1, q);
      a(258, 3, 4, y, 8);
      a(259, 3, 1, 1);
      a(262, 3, 1, 2);
      a(273, 4, 1, t, 0);
      a(277, 3, 1, 4);
      a(279, 4, 1, u);
      a(282, 5, 1, y, 8);
      a(283, 5, 1, y, 8);
      a(296, 3, 1, 2);
      a(305, 2, G.length, y, p(G));
      a(306, 2, 20, y, 20);
      a(338, 3, 1, 2);
      j();
      E(524296);
      E(524296);
      E(g);
      E(1);
      E(i);
      E(1);
      F(G);
      f =
        e.getFullYear() +
        ":" +
        B(e.getMonth() + 1) +
        ":" +
        B(e.getDate()) +
        " ";
      f += B(e.getHours()) + ":" + B(e.getMinutes()) + ":" + B(e.getSeconds());
      F(f);
      n.set(r.data, t);
      setTimeout(function () {
        c(m);
      }, x._dly);
    } catch (l) {
      if (x._error) {
        x._error(l.toString());
      }
    }
    function B(h) {
      h += "";
      return h.length === 1 ? "0" + h : h;
    }
    function D(h) {
      H.setUint16(C, h, v);
      C += 2;
    }
    function E(h) {
      H.setUint32(C, h, v);
      C += 4;
    }
    function F(w) {
      var h = 0;
      while (h < w.length) {
        H.setUint8(C++, w.charCodeAt(h++) & 255, v);
      }
      if (C & 1) {
        C++;
      }
    }
    function p(w) {
      var h = w.length;
      return h & 1 ? h + 1 : h;
    }
    function a(J, K, h, L, w) {
      D(J);
      D(K);
      E(h);
      if (w) {
        y += w;
        z.push(C);
      }
      if (h === 1 && K === 3 && !w) {
        D(L);
        D(0);
      } else {
        E(L);
      }
      k++;
    }
    function b(h) {
      s = h || C;
      C += 2;
    }
    function j() {
      H.setUint16(s, k, v);
      E(0);
      var h = 14 + k * 12;
      for (var w = 0, K, J; w < z.length; w++) {
        K = z[w];
        J = H.getUint32(K, v);
        H.setUint32(K, J + h, v);
      }
    }
  },
  toBlob: function (b, a, c) {
    this.toArrayBuffer(
      b,
      function (d) {
        a(new Blob([d], { type: "image/tiff" }));
      },
      c || {}
    );
  },
  toObjectURL: function (b, a, c) {
    this.toBlob(
      b,
      function (d) {
        var e = self.URL || self.webkitURL || self;
        a(e.createObjectURL(d));
      },
      c || {}
    );
  },
  toDataURL: function (b, a, d) {
    var c = this;
    c.toArrayBuffer(
      b,
      function (k) {
        var j = new Uint8Array(k),
          g = 1 << 20,
          f = g,
          h = "",
          e = "",
          m = 0,
          n = j.length;
        (function o() {
          while (m < n && f-- > 0) {
            h += String.fromCharCode(j[m++]);
          }
          if (m < n) {
            f = g;
            setTimeout(o, c._dly);
          } else {
            m = 0;
            n = h.length;
            f = 180000;
            (function i() {
              e += btoa(h.substr(m, f));
              m += f;
              m < n ? setTimeout(i, c._dly) : a("data:image/tiff;base64," + e);
            })();
          }
        })();
      },
      d || {}
    );
  },
};
