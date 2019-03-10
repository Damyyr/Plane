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

    getPosition(incrementsOfPath) {
        const t = incrementsOfPath % 1;
        const increment = Math.floor(incrementsOfPath % 4);
        const pointRelativeToOrigin = this.slopes.map((slope) => {
            return {
                latitude: slope.latitude * t,
                longitude: slope.longitude * t,
            };
        });
        return {
            latitude: this.origins[increment].latitude + pointRelativeToOrigin[increment].latitude,
            longitude: this.origins[increment].longitude + pointRelativeToOrigin[increment].longitude,
        }
    }
}

// const points = [
//     {
//         latitude: 45.533475,
//         longitude: -73.570720,
//     },
//     {
//         latitude: 45.534085,
//         longitude: -73.570177,
//     },
//     {
//         latitude: 45.532798,
//         longitude: -73.567383,
//     },
//     {
//         latitude: 45.532179,
//         longitude: -73.567960,
//     },
// ];
//
// let trajet = new Trajet(points);
// let point = trajet.getPosition(0.5); // Moitie du point 0 à 1
// console.log(point);