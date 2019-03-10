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

    getPosition(incrementsOfPath) {
        const fractionOfReadTravelled = incrementsOfPath % 1;
        const increment = Math.floor(incrementsOfPath % 4);
        const pointRelativeToOrigin = this.slopes.map((slope) => {
            return {
                latitude: slope.latitude * fractionOfReadTravelled,
                longitude: slope.longitude * fractionOfReadTravelled,
            };
        });
        return {
            latitude: this.origins[increment].latitude + pointRelativeToOrigin[increment].latitude,
            longitude: this.origins[increment].longitude + pointRelativeToOrigin[increment].longitude,
        }
    }
}