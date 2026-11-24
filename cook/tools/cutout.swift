// Remove the background of a photo with macOS's on-device subject segmentation (Vision).
// usage: swift cook/tools/cutout.swift <in.jpg> <out.png>
import Foundation
import Vision
import CoreImage

let args = CommandLine.arguments
guard args.count == 3 else { print("usage: cutout <in> <out.png>"); exit(1) }
let input = URL(fileURLWithPath: args[1])
let output = URL(fileURLWithPath: args[2])
guard let image = CIImage(contentsOf: input, options: [.applyOrientationProperty: true]) else { print("cannot read image"); exit(1) }

let handler = VNImageRequestHandler(ciImage: image)
let request = VNGenerateForegroundInstanceMaskRequest()
do {
  try handler.perform([request])
  guard let result = request.results?.first else { print("no subject found"); exit(2) }
  let buffer = try result.generateMaskedImage(ofInstances: result.allInstances, from: handler, croppedToInstancesExtent: false)
  let masked = CIImage(cvPixelBuffer: buffer)
  let context = CIContext()
  try context.writePNGRepresentation(of: masked, to: output, format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
  print("instances:", result.allInstances.count, "written:", output.path)
} catch {
  print("failed:", error)
  exit(3)
}
