# Documentation

## Handling Data

### 1. Obtain Data

The data is obtained from ACIS once all necessary parameters are set. Some of those parameters are provided by the user, such as selecting the station and entering a date.

### 2. Average Missing Values (M's)

Once the data is received, it is analyzed for missing values (M). In the following example, we will consider only temperature (˚C) data, for simplicity. However, the same logic applies to any weather data parameter, such as relative humidity, leaf wetness etc.

The following table shows the hourly temperature for an arbitrary day.

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

As evidenced above, the table contains missing values. Those will be replaced according to the following rules:

- Single missing values are replaced by averaging its contiguous values. Hence, missing value (M) at hour 14:00 will be replaced with (23+24)/2 = 23.5
- Two consecutive missing values are replaced with the weighted mean of the preceding and following values, In this case missing values at hour 05:00 will be replaced with the weigthed mean (18+18+16)/3 = 17.3, and missing value at hour 06:00 will be replaced with weigthed mean (16+16+18)/3 = 16.6

Applying the above rules, we obtain the following:

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

### 3. Replace Missing Values with Sister Station Data

At this point, it is possible that the dataset still contains missing values. To fix this, we replace those missing values with the sister station's available data.

After this step has been completed, two possibilties emerge. The first possible outcome is that all of the missing values are replaced. Hence, in our case, the temperature data for the selected day will no longer have missing values.

The second possibility is the persistence of missing values. This could likely be attributed to the sister station also containing missing values for the same points in time (day, hour) as needed for our data.

Another solution to address the missing values is to replace those fields with forecast data. However, it is done only if the user has selected a date in the current year. If the date selected by the user is not in the current year, the remaining missing values are not replaced with forecast data.

### 4. Handling Five or More Missing Values in a Day

Despite all of the aforementioned steps, it is possible for the data to contain missing values. Under these circumstances, if the number of missing values is greater than five, we discard the entire day. The date in question is saved and presented to the user at the right time, in order to inform the user of the missing data for that particular date.


work in progres...