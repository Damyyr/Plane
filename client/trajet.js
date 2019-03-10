export default class Trajet {
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

    getPosition(seconds) {
        const t = seconds % 3;
        const increment = Math.floor(t);
        const pointRelativeToOrigin = this.slopes.map((slope) => {
            return {
                latitude: slope.latitude * t,
                longitude: slope.longitude * t,
            };
        });
        return {
            latitude: this.origins[increment].latitude + pointRelativeToOrigin[increment].longitude,
            longitude: this.origins[increment].longitude + pointRelativeToOrigin[increment].longitude,
        }
    }
}

// let trajet = new Trajet(points);
// let point = trajet.getPosition(0.5);
// console.log(point);