% Load the data from the first CSV file
data1 = readmatrix('cmyStandard.csv');

% Extract columns for the first dataset
cyan1 = data1(:, 1);
magenta1 = data1(:, 2);
yellow1 = data1(:, 3);

% Load the data from the second CSV file
data2 = readmatrix('cmyPerceptual.csv');

% Extract columns for the second dataset
cyan2 = data2(:, 1);
magenta2 = data2(:, 2);
yellow2 = data2(:, 3);

% Plot the first dataset in cyan, magenta, and yellow
figure; % Create a new figure window
hold on; % Hold on to plot all datasets on the same plot
plot(cyan1, 'c', 'DisplayName', 'Cyan Standard'); % Cyan for the first dataset
plot(magenta1, 'm', 'DisplayName', 'Magenta Standard'); % Magenta for the first dataset
plot(yellow1, 'y', 'DisplayName', 'Yellow Standard'); % Yellow for the first dataset

% Plot the second dataset with different markers or line styles
plot(cyan2, 'c--', 'DisplayName', 'Cyan Perceptual'); % Dashed cyan for the second dataset
plot(magenta2, 'm--', 'DisplayName', 'Magenta Perceptual'); % Dashed magenta for the second dataset
plot(yellow2, 'y--', 'DisplayName', 'Yellow Perceptual'); % Dashed yellow for the second dataset

hold off; % Release the plot hold

% Enhance the plot
title('Comparison of Cyan, Magenta, and Yellow Values');
xlabel('Sample Number');
ylabel('Value');
legend('show'); % Show legend to identify each line
