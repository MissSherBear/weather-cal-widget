// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: calendar;
/*
~
Welcome to Weather Cal. Run this script to set up your widget.
Add or remove items from the widget in the layout section below.
You can duplicate this script to create multiple widgets. Make sure to change the name of the script each time.
Happy scripting!
~
*/

// Specify the layout of the widget items.
const layout = `
  
  row 
    column
      date
      sunset
      battery
    
    column(90)
      current
      future
      
  row
    column
      events
     
`

/*
 * CODE
 * Be more careful editing this section. 
 * =====================================
 */

// Names of Weather Cal elements.
const codeFilename = "Weather Cal code"
const gitHubUrl = "https://raw.githubusercontent.com/mzeryck/Weather-Cal/main/weather-cal-code.js"

// Determine if the user is using iCloud.
let files = FileManager.local()
const iCloudInUse = files.isFileStoredIniCloud(module.filename)

// If so, use an iCloud file manager.
files = iCloudInUse ? FileManager.iCloud() : files

// Determine if the Weather Cal code exists and download if needed.
const pathToCode = files.joinPath(files.documentsDirectory(), codeFilename + ".js")
if (!files.fileExists(pathToCode)) {
  const req = new Request(gitHubUrl)
  const codeString = await req.loadString()
  files.writeString(pathToCode, codeString)
}

// Import the code.
if (iCloudInUse) { await files.downloadFileFromiCloud(pathToCode) }
const code = importModule(codeFilename)
const custom = {
// Custom items and backgrounds can be added here.

  async background(widget) {
    if (!code.data.sun) { await code.setupSunrise() }
    const current = code.now.getTime()
    // Define file path
    const dirPath = files.joinPath(files.documentsDirectory(), "Weather Cal")
    if (!files.fileExists(dirPath) || !files.isDirectory(dirPath)) {files.createDirectory(dirPath) }
    
    files.writeImage(files.joinPath(directoryPath, 
    
     // Set default, 'daytime' background
     var path = files.joinPath(dirPath, "Weather Cal-light.jpg")

     // Determines if time now is at night
     if (code.isNight(code.now)) {
        var path = files.joinPath(dirPath, "Weather Cal-dark.jpg")
        return widget.backgroundImage = files.readImage(path)
     }

     //Check if device is using dark mode, use dark image if true
     /* if (Device.isUsingDarkAppearance()){
       var path = files.joinPath(dirPath, "Weather Cal-dark.jpg")
       return widget.backgroundImage = files.readImage(path)
     } */
     return widget.backgroundImage = files.readImage(path)
     }
}

// Run the initial setup or settings menu.
let preview
if (config.runsInApp) {
  preview = await code.runSetup(Script.name(), iCloudInUse, codeFilename, gitHubUrl)
  if (!preview) return
}

// Set up the widget.
const widget = await code.createWidget(layout, Script.name(), iCloudInUse, custom)
Script.setWidget(widget)

// If we're in app, display the preview.
if (config.runsInApp) {
  if (preview == "small") { widget.presentSmall() }
  else if (preview == "medium") { widget.presentMedium() }
  else { widget.presentLarge() }
}

Script.complete()
