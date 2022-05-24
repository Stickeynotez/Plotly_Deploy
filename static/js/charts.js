function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("static/js/samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("static/js/samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  };
  
  // Create the buildChart function.
  function buildCharts(sample) {
    // Use d3.json to load the samples.json file 
    d3.json("static/js/samples.json").then((data) => {
      console.log(data);
  
      // Create a variable that holds the samples array. 
      var samples = data.samples;
  
      // Create a variable that filters the samples for the object with the desired sample number.
      var resultArray = samples.filter(bacteriaInfo => bacteriaInfo.id == sample);
      var result = resultArray[0];
    
      // Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels.slice(0, 10).reverse();
      var sample_values = result.sample_values.slice(0, 10).reverse();
  
      // Create the yticks for the bar chart.
      var yticks = otu_ids.map(bacteriaInfo => "OTU " + bacteriaInfo).slice(0,10).reverse();
      
      // BAR CHART
      // Create the trace
      var bar_data = [{
          // Use otu_ids for the x values
          x: sample_values,
          // Use sample_values for the y values
          y: yticks,
          // Use otu_labels for the text values
          text: otu_labels,
          type: 'bar',
          orientation: 'h',
          marker: {
              color: 'rgb(69, 96, 255)'
          },
      }];
  
  
  
  
      // Define plot layout
      var bar_layout = {
          title: "Top 10 Bacteria Cultures Found",
          xaxis: { title: "Bacteria Culture Sample Values" },
          yaxis: { title: "OTU IDs" }
      };
  
      // Display plot
      Plotly.newPlot('bar', bar_data, bar_layout)
      
      // BUBBLE CHART
  
      var bubbleLabels = result.otu_labels;
      var bubbleValues = result.sample_values;
  
      // Create the trace
      var bubble_data = [{
        // Use otu_ids for the x values
        x: otu_ids,
        // Use sample_values for the y values
        y: bubbleValues,
        // Use otu_labels for the text values
        text: bubbleValues,
        mode: 'markers',
        marker: {
            // Use otu_ids for the marker colors
            color: otu_ids,
            // Use sample_values for the marker size
            size: bubbleValues,
            colorscale: 'YlGnBu'
        }
      }];
  
  
      // Define plot layout
      var layout = {
        title: "Bacteria Cultures Per Sample",
        xaxis: { title: "OTU IDs" },
        yaxis: { title: "Sample Values" },
        automargin: true,
        hovermode: 'closest'
      };
  
      // Display plot
      Plotly.newPlot('bubble', bubble_data, layout);
     
      
      //Create a variable that filters the metadata array for the object with the desired sample number
      var metadata = data.metadata;
      var gaugeArray = metadata.filter(bacteriaMetadata => bacteriaMetadata.id == sample);
  
      //Create a variable that hold the first sample in the metadata array
      var gaugeResult = gaugeArray[0];
  
      //Create a variable that hold the washing frequency
      var washFreq = gaugeResult.wfreq;
  
      // Create the trace for the gauge chart.
      var gaugeData =  [{
          domain: { x: [0, 1], y: [0, 1] },
          value: washFreq,
          title: { text: "Washing Frequency (Scrubs Per Week)" },
          type: "indicator",
          mode: "gauge+number",
           gauge: {
              bar: {color: 'black'},
              axis: { range: [null, 9] },
              steps: [
                  { range: [0, 2], color: 'rgb(255, 0, 75)' },
                  { range: [2, 4], color: 'rgb(200, 0, 115)' },
                  { range: [4, 6], color: 'rgb(148, 0, 175)' },
                  { range: [6, 8], color: 'rgb(102, 0, 200)'},
                  { range: [8, 10], color: 'rgb(61, 0, 255)'}
              ],
               
            }
        
      }];
      
      // Create the layout for the gauge chart.
      var gaugeLayout = { width: 500, height: 400, margin: { t: 0, b: 0 } };
  
      // Use Plotly to plot the gauge data and layout.
      Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    });
  }