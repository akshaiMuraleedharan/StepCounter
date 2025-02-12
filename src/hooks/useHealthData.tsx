import AppleHealthKit, {
  HealthInputOptions,
  HealthKitPermissions,
} from 'react-native-health';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import {
  initialize,
  requestPermission,
  readRecords,
} from 'react-native-health-connect';
import { TimeRangeFilter } from 'react-native-health-connect/lib/typescript/types/base.types';

const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.FlightsClimbed,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
      AppleHealthKit.Constants.Permissions.HeartRate,
      AppleHealthKit.Constants.Permissions.OxygenSaturation,
    ],
    write: [],
  },
};

const useHealthData = (date: Date) => {
  const [hasPermissions, setHasPermission] = useState(false);
  const [steps, setSteps] = useState(0);
  const [flights, setFlights] = useState(0);
  const [distance, setDistance] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [bloodOxygen, setBloodOxygen] = useState(0);

  // iOS - HealthKit
  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    AppleHealthKit.isAvailable((err, isAvailable) => {
      if (err) {
        console.log('Error checking availability');
        return;
      }
      if (!isAvailable) {
        console.log('Apple Health not available');
        return;
      }
      AppleHealthKit.initHealthKit(permissions, (err) => {
        if (err) {
          console.log('Error getting permissions');
          return;
        }
        setHasPermission(true);
      });
    });
  }, []);

  useEffect(() => {
    if (!hasPermissions) {
      return;
    }

    const options: HealthInputOptions = {
      date: date.toISOString(),
      includeManuallyAdded: false,
    };

    AppleHealthKit.getStepCount(options, (err, results) => {
      if (!err && results) {
        setSteps(results.value);
      }
    });

    AppleHealthKit.getFlightsClimbed(options, (err, results) => {
      if (!err && results) {
        setFlights(results.value);
      }
    });

    AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
      if (!err && results) {
        setDistance(results.value);
      }
    });

    AppleHealthKit.getHeartRateSamples(
      { startDate: new Date(date.setHours(0, 0, 0, 0)).toISOString() },
      (err, results) => {
        if (!err && results?.length > 0) {
          const avgHeartRate =
            results.reduce((sum, sample) => sum + sample.value, 0) /
            results.length;
          setHeartRate(Math.round(avgHeartRate));
        }
      }
    );

    AppleHealthKit.getOxygenSaturationSamples(
      { startDate: new Date(date.setHours(0, 0, 0, 0)).toISOString() },
      (err, results) => {
        if (!err && results?.length > 0) {
          const avgBloodOxygen =
            results.reduce((sum, sample) => sum + sample.value, 0) /
            results.length;
          setBloodOxygen(Math.round(avgBloodOxygen));
        }
      }
    );
  }, [hasPermissions, date]);

  // Android - Health Connect
  const readSampleData = async () => {
    const isInitialized = await initialize();
    if (!isInitialized) {
      return;
    }

    await requestPermission([
      { accessType: 'read', recordType: 'Steps' },
      { accessType: 'read', recordType: 'Distance' },
      { accessType: 'read', recordType: 'FloorsClimbed' },
      { accessType: 'read', recordType: 'HeartRate' },
      { accessType: 'read', recordType: 'OxygenSaturation' },
    ]);

    const timeRangeFilter: TimeRangeFilter = {
      operator: 'between',
      startTime: new Date(date.setHours(0, 0, 0, 0)).toISOString(),
      endTime: new Date(date.setHours(23, 59, 59, 999)).toISOString(),
    };

    const steps = await readRecords('Steps', { timeRangeFilter });
    setSteps(steps.reduce((sum, cur) => sum + cur.count, 0));

    const distance = await readRecords('Distance', { timeRangeFilter });
    setDistance(distance.reduce((sum, cur) => sum + cur.distance.inMeters, 0));

    const floorsClimbed = await readRecords('FloorsClimbed', {
      timeRangeFilter,
    });
    setFlights(floorsClimbed.reduce((sum, cur) => sum + cur.floors, 0));

    const heartRateRecords = await readRecords('HeartRate', { timeRangeFilter });
    if (heartRateRecords.length > 0) {
      const avgHeartRate =
        heartRateRecords.reduce((sum, record) => sum + record.heartRate, 0) /
        heartRateRecords.length;
      setHeartRate(Math.round(avgHeartRate));
    }

    const bloodOxygenRecords = await readRecords('OxygenSaturation', {
      timeRangeFilter,
    });
    if (bloodOxygenRecords.length > 0) {
      const avgBloodOxygen =
        bloodOxygenRecords.reduce((sum, record) => sum + record.percentage, 0) /
        bloodOxygenRecords.length;
      setBloodOxygen(Math.round(avgBloodOxygen));
    }
  };

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }
    readSampleData();
  }, [date]);

  return {
    steps,
    flights,
    distance,
    heartRate,
    bloodOxygen,
  };
};

export default useHealthData;