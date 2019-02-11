# Documentation

## Handling Data

### 1. Obtain data

The data is obtained from ACIS once all necessary parameters are set. Some of those parameters are provided by the user, such as selecting the station and entering a date.

### 2. Average missing values (M's)

Once the data is received, it is analyzed for missing values (M). In the following example, we will consider only temperature (˚C) data, for simplicity. However, the same logic applies to any weather data parameter, such as relative humidity, leaf wetness etc.

The Table below shows temperature hourly data for an arbitrary day.

| Hour  | Temp (˚C) |
| :---: | :-------: |
| 00:00 |    19     |
| 01:00 |    20     |
| 02:00 |    20     |
| 03:00 |    19     |
| 04:00 |    18     |
| 05:00 |   **M**   |
| 06:00 |   **M**   |
| 07:00 |    16     |
| 08:00 |    18     |
| 09:00 |    19     |
| 10:00 |    20     |
| 11:00 |    21     |
| 12:00 |    22     |
| 13:00 |    23     |
| 14:00 |   **M**   |
| 15:00 |    24     |
| 16:00 |    23     |
| 17:00 |    23     |
| 18:00 |    23     |
| 19:00 |    23     |
| 20:00 |   **M**   |
| 21:00 |   **M**   |
| 22:00 |   **M**   |
| 23:00 |    18     |

As shown the table above contains missing values. Those will be replaced according to the following rules:

- Single missing values are replaced by averaging its contiguous values. Hence, missing value (M) at hour 14:00 will be replaced with (23+24)/2 = 23.5
- Two consecutive missing values are replaced with the weighted mean of the preceding and following values, In this case missing values at hour 05:00 will be replaced with the weigthed mean (18+18+16)/3 = 17.3, and missing value at hour 06:00 will be replaced with weigthed mean (16+16+18)/3 = 16.6

Applying the rules above we obtain the following:

| Hour  | Temp (˚C) |
| :---: | :-------: |
| 00:00 |    19     |
| 01:00 |    20     |
| 02:00 |    20     |
| 03:00 |    19     |
| 04:00 |    18     |
| 05:00 | **17.3**  |
| 06:00 | **16.6**  |
| 07:00 |    16     |
| 08:00 |    18     |
| 09:00 |    19     |
| 10:00 |    20     |
| 11:00 |    21     |
| 12:00 |    22     |
| 13:00 |    23     |
| 14:00 | **23.5**  |
| 15:00 |    24     |
| 16:00 |    23     |
| 17:00 |    23     |
| 18:00 |    23     |
| 19:00 |    23     |
| 20:00 |   **M**   |
| 21:00 |   **M**   |
| 22:00 |   **M**   |
| 23:00 |    18     |

### 3. Replace missing values with sister station data

At this point the data might still have missing values. To fix that, we replace those missing values with the sister station's available data.

After this step is completed, two scenarios might emerge. The first scenario is the replacement of all remaining missing values, hence in our case the temperature data for that day will no longer have any missing values.

The second scenario, is still the presence of missing values. The cause of that could be that the sister station had missing values as well at the same point in time (day and hour) and hence did not provide a valid alternative.

Another step we take to replace those remaining missing values is to replace them with forecast data. However, it is done only if the user has chosen a date in the current year. If the date selected by the user is not in the current year, the remaining missing values are not replaced with forecast data.

### 4. Handling 5 or more missing values in a day

Even after all those steps, the data temperature might still contain missing values. At this point if the numer of missing value is greater than 5, we discard the entire day. The date in question is saved and presented to the user at the right time, to inform him/her of the missing data for that particular date.


