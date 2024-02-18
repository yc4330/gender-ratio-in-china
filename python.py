import numpy as np
import matplotlib.pyplot as plt
from scipy.interpolate import UnivariateSpline

# define the data
x = np.array([50, 100, 200, 500, 800, 1000, 2000, 3000, 4000, 5000, 6000, 8000, 10000, 15000, 20000, 30000, 40000, 50000])
y_min = np.array([57.82, 68.62, 77.2, 85.57, 88.79, 90.1, 93.44, 94.95, 95.87, 96.5, 96.97, 97.63, 98.08, 98.79, 99.21, 99.72, 100.02, 100.23])
y_max = np.array([190.21, 159.64, 141.64, 127.64, 122.98, 121.18, 116.83, 114.96, 113.86, 113.11, 112.56, 111.8, 111.28, 110.48, 110.01, 109.45, 109.12, 108.34])

# plot them
plt.plot(x, y_min, 'ro')
plt.plot(x, y_max, 'ro')

# create a set of new x values for drawing the smooth curves
xnew = np.linspace(x.min(), x.max(), 500)

# fit a smooth curve through the y_min and y_max data
spl_min = UnivariateSpline(x, y_min, k=5)
spl_max = UnivariateSpline(x, y_max, k=5)

# plot the smooth curves
plt.plot(xnew, spl_min(xnew), 'gray')
plt.plot(xnew, spl_max(xnew), 'gray')

# fill the area between the curves
plt.fill_between(xnew, spl_min(xnew), spl_max(xnew), color='gray', alpha=0.2)

# set x and y axis limits
plt.xlim(0, 10000)
plt.ylim(50, 200)

plt.show()