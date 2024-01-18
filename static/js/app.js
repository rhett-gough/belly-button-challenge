// Get the samples endpoint
const samples_json = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the data and console log it
d3.json(samples_json).then(function(data) {
    console.log(data);
});

// Set the first charts at start up
function init() {

    // Fetch all the data
    d3.json(samples_json).then((data) => {

        // Use D3 to select the dropdown menu
        let dropdownMenu = d3.select("#selDataset");

        // Use D3 to get sample names for the dropdown menu
        let sample_names = data.names;

        // Add sample names to the dropdown menu
        sample_names.forEach((id) => {

            // Log each id
            console.log(id);

            // Add each id's value to the dropdown menu
            dropdownMenu.append("option").text(id).property("value");
        });
        
        // Use first sample for page start up
        let first_sample = sample_names[0];

        // Log the value of the first sample
        console.log(first_sample);

        // Use that data for the first page
        metadataTable(first_sample);
        makeCharts(first_sample);
    });
};

// Change the option function
function optionChanged(value) {
    metadataTable(value);
    makeCharts (value);
};

// Metadata Table function
function metadataTable(sample) {

    // Use D3 to fetch the data
    d3.json(samples_json).then((data) => {

        // Get all of the metadata
        let metadata = data.metadata;

        // Filter by sample 
        let specific_sample = metadata.filter(result => result.id == sample);

        // Use D3 to select the metadata table and clear it out
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each element to the table
        Object.entries(specific_sample[0]).forEach(([key,value]) => {

            // Log the elements added to the table
            console.log(key,value);

            // Append the metadata to the table
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);

        });
    });
};

// bar chart function
function makeCharts(sample) {

    // Use D3 to fetch the data
    d3.json(samples_json).then((data) => {

        // Get the sample data
        let sampleData = data.samples;

        // filter by sample
        let specific_sample = sampleData.filter(result => result.id == sample);

        // Get the otu_ids, otu_labels, and sample_values
        let otu_ids = specific_sample[0].otu_ids;
        let otu_labels = specific_sample[0].otu_labels;
        let sample_values = specific_sample[0].sample_values;

        // Log the chart data to the consolue
        console.log(otu_ids,otu_labels,sample_values);

        // Set the top 10 items to display in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        let xticks = sample_values.slice(0,10).reverse();

        // Setup the data for the bar chart
        let barchartdata = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Setup the layout for the bar chart
        let barchartlayout = {
            height: 700,
            width: 600
        };

        // Setup the data for the bubble chart data
        let bubblechartdata = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Setup the layout of the bubble chart
        let bubblechartlayout = {
            height: 500,
            width: 1200
        };

        // Render the bar chart to the div tag with id "bar"
        Plotly.newPlot("bar",[barchartdata],barchartlayout);

        // Render the bubble chart to the div tag with id "bubble"
        Plotly.newPlot("bubble",[bubblechartdata],bubblechartlayout);
    });
};

// Call the initialize function
init();