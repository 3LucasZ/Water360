export interface global {}
declare global {
  var init: boolean = false;

  var IP: string = "";
  var MAC: string = "";
  var downloadsDir: string = "";
  var settingsDir: string = "";
  var RTMP: string = "";

  var exporting: boolean = true;
  var exportSoFar: number = 0;
  var exportTotal: number = 0;
}
