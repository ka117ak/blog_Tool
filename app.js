const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const axios = require('axios');
const lodash = require('lodash');

app.use(express.json());

app.get('/api/blog-search', async (req, res) => {
    try {
        const searchQuery = req.query.query;
        const headers = {
            'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
        };
        const value = await axios.get("https://intent-kit-16.hasura.app/api/rest/blogs", { headers })
        const Data = value.data.blogs;

        //Error handling for search if empty 
        if (!searchQuery || searchQuery.trim() === '') {
            return res.status(400).json({ error: 'Invalid search query' });
        }

        const Results = Data.filter((blogs) =>
            blogs.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        res.json({ results: Results });
    } catch (error) {
        console.error('Error in search', error);
        res.status(500).json({ error: 'An error occurred while processing the search request' });
    }
});

app.get('/api/blog-stats', async (req, res) => {
    try {
        const headers = {
            'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
        };
        const value = await axios.get("https://intent-kit-16.hasura.app/api/rest/blogs", { headers })
        const Data = value.data.blogs;
        const total = lodash.uniqBy(Data, 'id').length;
        const longestTitle = lodash.maxBy(Data, 'title.length').title;
        const Privacy = lodash.filter(Data, (blogs) =>
            blogs.title.toLowerCase().includes('privacy')
        ).length;
        const unique = lodash.uniq(lodash.map(Data, 'title'));

        res.json({ total, longestTitle, Privacy, unique });
    }
    catch (error) {
        console.error('Error in fetching and analyzing blog data:', error);
        res.status(500).json({ error: 'An error occurred while processing request' });
    }
});


app.listen(port, function (err) {
    if (err) console.log(err);
    console.log(`Server is running on port ${port}`);
});