var map;
var directionsDisplay = null;
var directionsService;
var polylinePath;
var markerLoc = [];
var lastMarkerLoc = [];
var markers = [];
var distArray = [];
//showing basic start path between markers with no route
var destinations = new google.maps.MVCArray();
var polyline = new google.maps.Polyline({
  path: destinations,
  strokeColor: "#000000",
  strokeOpacity: 0.75,
  strokeWeight: 2
});
// Initialize google maps
function initMap() {
    // Map options goes here
    var opts = {
        center: new google.maps.LatLng(53.347907, -6.246636),
        zoom: 12,
        streetViewControl: false,
        mapTypeControl: false,
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), opts);

    polyline.setMap(map);
    // Create map click event
    google.maps.event.addListener(map, 'click', function(event) {
        // Add destination (max 10)
        if (markerLoc.length >= 10) {
            alert('Max destinations added');
            return;
        }
        // Clears direction being shown, if there is any
        clearDirs();

        // Add an element to map
        marker = new google.maps.Marker({position: event.latLng, map: map});
        markers.push(marker);

        // Element's lat and lng stored in this line of code
        markerLoc.push(event.latLng);

        var currentPath = polyline.getPath();
        currentPath.push(event.latLng);
        console.log(currentPath);
        // Shows amount of markers on page
        $('#dest-count').html(markerLoc.length);
    });
    // Location
    infoWindow = new google.maps.InfoWindow;

        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(p) {
            var position = {
            lat: p.coords.latitude,
            lng: p.coords.longitude
        };
      infoWindow.setPosition(position);
      infoWindow.setContent('You');
      infoWindow.open(map);
    }, function() {
      handleLocError('geo failed', map.center());
    });
  } else {
    handleLocError('no geo avalible', map.center());
  }
}
// Acquire distance of route between markers from google maps api
function getDists(callback) {
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
        origins: markerLoc,
        destinations: markerLoc,
        travelMode: google.maps.TravelMode['WALKING'],
        
	// Distance between markers is stored
    }, function(distData) {
        var markerDistance;
        for (startMarker in distData.rows) {
            markerDistance = distData.rows[startMarker].elements;
            distArray[startMarker] = [];
            for (finalMarker in markerDistance) {
                if (distArray[startMarker][finalMarker] = markerDistance[finalMarker].distance == undefined) {
                    alert('Check marker placement');
                    return;
                }
                distArray[startMarker][finalMarker] = markerDistance[finalMarker].distance.value;
            }
        }
        if (callback != undefined) {
            callback();
        }
        //console.log(distArray);
    });
}
// Map is completely cleared
function clearMap() {
    clearMakers();
    clearDirs();
    polyline.setMap(null);

    $('#dest-count').html('0');
}
// This removes the temporary paths and markers
function clearMakers() {
    for (index in markers) {
        markers[index].setMap(null);
    }
    lastMarkerLoc = markerLoc;
    markerLoc = [];
    if (polylinePath != undefined) {
        polylinePath.setMap(null);
    }

    markers = [];
    $('#btns').show();
}
// This function removes the map direction
function clearDirs() {
    // If there are directions being shown, clear them
    if (directionsDisplay != null) {
        directionsDisplay.setMap(null);
        directionsDisplay = null;
    }
}
// When page is loaded
google.maps.event.addDomListener(window, 'load', initMap);
// Create listeners
$(document).ready(function() {
    $('#clear').click(clearMap);
    // Run algorithm using the markers placed on the map
    $('#calc-route').click(function() {
      polyline.setMap(null);
        if (markerLoc.length < 2) {
            if (lastMarkerLoc.length >= 2) {
                markerLoc = lastMarkerLoc;
            } else {
                alert('No Markers Placed');
                return;
            }
        }
        if (directionsDisplay != null) {
            directionsDisplay.setMap(null);
            directionsDisplay = null;
        }

        $('#btns').hide();
        // This enables the user to get route distances
        getDists(function(){
            $('.info').show();
            // Create initial population and get config

            var pop = new genAlg.population();
            pop.initialize(markerLoc.length);
            var route = pop.getFittest().chromosome;
            genAlg.evolvePop(pop, function(update) {
                $('#gen-passed').html(update.generation);
                $('#best-route').html((update.population.getFittest().getDistance() /1000).toFixed(1));
                // population is checked for each time the generation runs to see the new values
                console.log(pop);

                // This is to get the coordinates for the route
                var route = update.population.getFittest().chromosome;
                var routeCoords = [];
                for (index in route) {
                    routeCoords[index] = markerLoc[route[index]];
                }
                routeCoords[route.length] = markerLoc[route[0]];
                // This statement shows the temporary route which is currently the best option
                if (polylinePath != undefined) {
                    polylinePath.setMap(null);
                }
                // Calculates the options for the route between markers
                polylinePath = new google.maps.Polyline({
                    path: routeCoords,
                    strokeColor: "#000000",
                    strokeOpacity: 0.75,
                    strokeWeight: 2,
                });
                polylinePath.setMap(map);
            }, function(result) {
                // This is to get the route
                route = result.population.getFittest().chromosome;
                // This is to add the route to the map
                directionsService = new google.maps.DirectionsService();
                directionsDisplay = new google.maps.DirectionsRenderer();
                directionsDisplay.setMap(map);
                var waypts = [];
                for (var i = 1; i < route.length; i++) {
                    waypts.push({
                        location: markerLoc[route[i]],
                        stopover: true
                    });
                }

                // Adding the final route to the map
                var request = {
                    origin: markerLoc[route[0]],
                    destination: markerLoc[route[0]],
                    waypoints: waypts,
                    travelMode: google.maps.TravelMode['WALKING'],
                    avoidHighways: false,

                };
                directionsService.route(request, function(response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                    }
                    clearMakers();
                });
            });
        });
    });
});
// Genetic Algorithm code
var genAlg = {
    // Default config
    "elitism": true,
    "sizeOfPop": 50,
    "rateOfMutation": 0.1,
    "maxGens": 50,
    "selectionSize": 5,
	// slows down process to show us how it is changing root
    "tickerSpeed": 70,

    // Evolves given population until max set generation is passed
    "evolvePop": function(population, generationCallBack, completeCallBack) {
        var generation = 1;
        var evolveInterval = setInterval(function() {
            if (generationCallBack != undefined) {
                generationCallBack({
                    population: population,
                    generation: generation,
                });
            }
            population = population.crossover();
            population.mutate();
            generation++;

            if (generation > genAlg.maxGens) {
                // Stop looping
                clearInterval(evolveInterval);

                if (completeCallBack != undefined) {
                    completeCallBack({
                        population: population,
                        generation: generation,
                    });
                }
            }
        }, genAlg.tickerSpeed);
    },
    // The Population holds the individuals that have been selected with the highest fitness value
    "population": function() {
        this.individuals = [];

        // The first population of random individuals with given chromosome length
        this.initialize = function(chromosomeLength) {
            this.individuals = [];

            for (var i = 0; i < genAlg.sizeOfPop; i++) {
                var newIndividual = new genAlg.individual(chromosomeLength);
                newIndividual.initialize();
                this.individuals.push(newIndividual);
            }
        };

        // Takes the individuals and checks to see if they should tested for mutation if they are not the fittest
		// This is where random order to set to change the fitness of individuals to achieve a overall higher value of fittest
        this.mutate = function() {
            var fittestIndex = this.getFittestIndex();
            for (index in this.individuals) {
                if (genAlg.elitism != true || index != fittestIndex) {
                    this.individuals[index].mutate();
                }
            }
        };
        // Breeds population to create new population childeren
		// This is to create a overall fitter population
		//
        this.crossover = function() {
            var newPopulation = new genAlg.population();
            // Find fittest individual
            var fittestIndex = this.getFittestIndex();
            for (index in this.individuals) {
                // testing to improve average populations fitness value
                if (genAlg.elitism == true && index == fittestIndex) {
                    // duplicating the elite individual
                    var eliteIndividual = new genAlg.individual(this.individuals[index].chromosomeLength);
                    eliteIndividual.setChromosome(this.individuals[index].chromosome.slice());
                    newPopulation.addIndividual(eliteIndividual);
                } else {
                    // pairing together parents for breeding
                    var parent = this.individualSelection();
                    // Apply crossover
                    this.individuals[index].crossover(parent, newPopulation);
                }
            }

            return newPopulation;
        };
        // Pushes individual to the population
        this.addIndividual = function(individual) {
            this.individuals.push(individual);
        };
        // This picking out a individual and compairs it then discards the weaker one
        this.individualSelection = function() {
            // Reorder the population
            for (var i = 0; i < this.individuals.length; i++) {
                var randomIndex = Math.floor(Math.random() * this.individuals.length);
                var tempIndividual = this.individuals[randomIndex];
                this.individuals[randomIndex] = this.individuals[i];
                this.individuals[i] = tempIndividual;
            }
            // Creating selected population and adding selected individuals
            var populationSelection = new genAlg.population();
            for (var i = 0; i < genAlg.selectionSize; i++) {
                populationSelection.addIndividual(this.individuals[i]);
            }
            return populationSelection.getFittest();
        };
        // This gives us the best individuals from the population
        this.getFittestIndex = function() {
            var fittestIndex = 0;
            // Check all fitness values and return highest
            for (var i = 1; i < this.individuals.length; i++) {
                if (this.individuals[i].calcFitness() > this.individuals[fittestIndex].calcFitness()) {
                    fittestIndex = i;
                }
            }
            return fittestIndex;
        };
        // This returns the fittest individual to the population
        this.getFittest = function() {
            return this.individuals[this.getFittestIndex()];
        };
    },
    // Creates individuals which are randomly assinged chromosomes which is used to get the total distance for each individual
	// the fitness value is based off the distance of the individual
	// then we mate the individual to form an offspring which will be added to the population
    "individual": function(chromosomeLength) {
        this.chromosomeLength = chromosomeLength;
        this.fitness = null;
        this.chromosome = [];
        this.initialize = function() {
            this.chromosome = [];
            // Generate random chromosome
            for (var i = 0; i < this.chromosomeLength; i++) {
                this.chromosome.push(i);
            }
            for (var i = 0; i < this.chromosomeLength; i++) {
                var randomIndex = Math.floor(Math.random() * this.chromosomeLength);
                var tempMarker = this.chromosome[randomIndex];
                this.chromosome[randomIndex] = this.chromosome[i];
                this.chromosome[i] = tempMarker;
            }
        };
        this.setChromosome = function(chromosome) {
            this.chromosome = chromosome;
        };
		
        this.mutate = function() {
            this.fitness = null;

            // This loops over chromosome making random changes
            for (index in this.chromosome) {
                if (genAlg.rateOfMutation > Math.random()) {
                    var randomIndex = Math.floor(Math.random() * this.chromosomeLength);
                    var tempMarker = this.chromosome[randomIndex];
                    this.chromosome[randomIndex] = this.chromosome[index];
                    this.chromosome[index] = tempMarker;
                }
            }
        };

        // This is the route distance for each individual
        this.getDistance = function() {
            var totalDistance = 0;
            for (index in this.chromosome) {
                var startPoint = this.chromosome[index];
                var endPoint = this.chromosome[0];
                if ((parseInt(index) + 1) < this.chromosome.length) {
                    endPoint = this.chromosome[(parseInt(index) + 1)];
                }
                totalDistance += distArray[startPoint][endPoint];
            }

            totalDistance += distArray[startPoint][endPoint];

            return totalDistance;
        };
        this.calcFitness = function() {
            if (this.fitness != null) {
                return this.fitness;
            }

            var totalDistance = this.getDistance();
            this.fitness = 1 / totalDistance;
            return this.fitness;
        };
        // Breeds current individual with a mate and add offspring to population
        this.crossover = function(individual, offspringPopulation) {
			// randomly places chromosomes from individual to its offspring
            var offspringChromosome = [];
            var startPos = Math.floor(this.chromosome.length * Math.random());
            var endPos = Math.floor(this.chromosome.length * Math.random());
            var i = startPos;
            while (i != endPos) {
                offspringChromosome[i] = individual.chromosome[i];
                i++
                if (i >= this.chromosome.length) {
                    i = 0;
                }
            }
            // adds remaining genetic info from mate
            for (parentIndex in individual.chromosome) {
                var point = individual.chromosome[parentIndex];
                var pointFound = false;
                for (offspringIndex in offspringChromosome) {
                    if (offspringChromosome[offspringIndex] == point) {
                        pointFound = true;
                        break;
                    }
                }
                if (pointFound == false) {
                    for (var offspringIndex = 0; offspringIndex < individual.chromosome.length; offspringIndex++) {
                        if (offspringChromosome[offspringIndex] == undefined) {
                            offspringChromosome[offspringIndex] = point;
                            break;
                        }
                    }
                }
            }
            // Finally add chromosomes onto the offspring then add it to the population
            var offspring = new genAlg.individual(this.chromosomeLength);
            offspring.setChromosome(offspringChromosome);
            offspringPopulation.addIndividual(offspring);
        };
    },
};
