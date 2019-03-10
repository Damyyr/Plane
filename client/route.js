export default class Route {
    constructor(listPoints) {
        const originalPoints = [...listPoints];
        this.origins = originalPoints;
        const firstElement = listPoints.shift();
        listPoints.push(firstElement);
        this.slopes = originalPoints.map((originalPoint, index) => {
            return {
                latitude: listPoints[index].latitude - originalPoint.latitude,
                longitude: listPoints[index].longitude - originalPoint.longitude,
            }
        });
    }

    getPosition(incrementsOfPath, lights, callback) {
        const fractionOfRoadTravelled = incrementsOfPath % 1;
        const increment = Math.floor(incrementsOfPath % 4);
        const pointRelativeToOrigin = this.slopes.map((slope) => {
            return {
                latitude: slope.latitude * fractionOfRoadTravelled,
                longitude: slope.longitude * fractionOfRoadTravelled,
            };
        });

        let blocked = false;
        if (fractionOfRoadTravelled < 0.005) { // TODO: Use big-number to have better precision(as it has float precision currently which is bad with multiple additions)
            const currentIntersection = this.origins[increment];
            let lightsAtIntersection = lights.filter((light) => {
                // TODO: Good filter function
            });
            // Find if light is red and stay at intersection if it's the case and set blocked at true
        }

        callback(blocked);
        return {
            latitude: this.origins[increment].latitude + pointRelativeToOrigin[increment].latitude,
            longitude: this.origins[increment].longitude + pointRelativeToOrigin[increment].longitude,
        }
    }
}