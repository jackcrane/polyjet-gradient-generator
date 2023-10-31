ffmpeg -y -framerate 10 -i output/slice_%03d.png -c:v libx264 -pix_fmt yuv420p output_video.mp4
