import { readFile } from "fs/promises";
import { instantiate, cmsInfoDescription } from "lcms-wasm";

const lcms = await instantiate();
const path = "./Tavor_Xrite_i1Profiler_VividCMYW.icc";
const buf = (await readFile(path)).buffer;
const profile = lcms.cmsOpenProfileFromMem(new Uint8Array(buf), buf.byteLength);
if (!profile) {
  throw new Error(`could not open profile ${path}`);
}
const name = lcms.cmsGetProfileInfoASCII(
  profile,
  cmsInfoDescription,
  "en",
  "US"
);
const space = lcms.cmsGetColorSpaceASCII(profile);
console.log(name, space);
