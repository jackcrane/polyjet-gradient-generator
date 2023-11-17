clc; clear; close all;
RGB_Colormap = colormap("hsv");

HSV_rep = rgb2hsv(RGB_Colormap);

CMY_est = 1-RGB_Colormap;

cform = makecform('srgb2cmyk');
CMYK_rep = applycform(RGB_Colormap,cform); 

inprof = iccread('sRGB.icm');
outprof = iccread('StratasysCMY.icc');
cform = makecform('icc',inprof,outprof);
CMY_rep = applycform(RGB_Colormap,cform); 

inprof = iccread('sRGB.icm');
outprof = iccread('Stratasys_J8_7xx_VeroPureWhite_HT3_VividCMY.icm');
cform = makecform('icc',inprof,outprof);
CMYW_rep = applycform(RGB_Colormap,cform); 

inprof = iccread('sRGB.icm');
outprof = iccread('Tavor_Xrite_i1Profiler_VividCMYW.icc');
cform = makecform('icc',inprof,outprof);
CMYW_xrite = applycform(RGB_Colormap,cform); 

subplotCount = 7;

figure(1)
subplot(subplotCount,1,1)
rgbplot(RGB_Colormap)
title('RGB Representation of Hue')
legend('Red','Green','Blue')

subplot(subplotCount,1,2)
rgbplot(HSV_rep)
title('Hue Sat Val parameters')
legend('Hue','Sat','Val')

subplot(subplotCount,1,3)
p1 = plot(CMY_est);
p1(1).Color = "c";
p1(2).Color = "m";
p1(3).Color = "y";
title('CMY Estimate')
legend('Cyan','Mag','Yel')

subplot(subplotCount,1,4)
p2 = plot(CMYK_rep);
p2(1).Color = "c";
p2(2).Color = "m";
p2(3).Color = "y";
p2(4).Color = "k";
title('CMYK Representation')
legend('Cyan','Mag','Yel','Key')
csvwrite("lib/MatlabCMYK.csv", CMYK_rep);

subplot(subplotCount,1,5)
p3 = plot(CMY_rep);
p3(1).Color = "c";
p3(2).Color = "m";
p3(3).Color = "y";
p3(4).Color = "k";
title('Stratasys CMY Representation')
legend('Cyan','Mag','Yel','Blank')
csvwrite("lib/StratasysCMY.csv", CMY_rep);

subplot(subplotCount,1,6)
p4 = plot(CMYW_rep);
p4(1).Color = "c";
p4(2).Color = "m";
p4(3).Color = "y";
p4(4).Color = "k";
title('Stratasys PureWhite CMYW Representation')
legend('Cyan','Mag','Yel','White')
csvwrite("lib/StratasysPureWhiteCMYW.csv", CMYW_rep);

subplot(subplotCount,1,7)
p4 = plot(CMYW_xrite);
p4(1).Color = "c";
p4(2).Color = "m";
p4(3).Color = "y";
p4(4).Color = "k";
title('Tavor Xrite')
legend('Cyan','Mag','Yel','White')
csvwrite("lib/StratasysTavorXrite.csv", CMYW_xrite);



figure(2)
subplot(2,1,2); 
p3 = plot(CMY_rep);
p3(1).Color = "c";
p3(2).Color = "m";
p3(3).Color = "y";
p3(4).Color = "k";
title('Stratasys CMY Representation')
subtitle('What it is')
legend('Cyan','Mag','Yel','Blank')

subplot(2,1,1); 
p1 = plot(CMY_est);
p1(1).Color = "c";
p1(2).Color = "m";
p1(3).Color = "y";
title('CMY Estimate')
subtitle('What it should be')
legend('Cyan','Mag','Yel')