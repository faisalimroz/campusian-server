const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const bodyParser = require('body-parser');


// Middleware to parse JSON requests
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
//middleware

app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});
// app.use((req, res, next) => {
 
//   next();
// });



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tort7uo.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    const blogCollection = client.db('campusian').collection('blog');
    const userCollection = client.db("campusian").collection("users");
    const jobCollection = client.db("campusian").collection("job");
    const scholarshipCollection = client.db("campusian").collection("scholarship");
    const researchPaperCollection = client.db("campusian").collection("research");
    const newsCollection = client.db("campusian").collection("news");
    const eventCollection = client.db("campusian").collection("event");

    app.get('/users', async (req, res) => {
      try {
        const query = {};
        const users = await userCollection.find(query).toArray();
     
        res.send(users);
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
      }
    });
  
    
app.get('/users/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;
    const query = { email: userEmail };
    const user = await userCollection.findOne(query);

    if (user) {
      res.json({ role: user.role });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
    
    app.delete('/users/:id', async (req, res) => {
      const userId = req.params.id;
    
      try {
        // Use new keyword when creating ObjectId instance
        const result = await userCollection.deleteOne({ _id: new ObjectId(userId) });
    
        if (result.deletedCount === 1) {
          res.json({ message: 'User deleted successfully' });
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    
    app.patch('/users/:id', async (req, res) => {
      const userId = req.params.id;

      try {
        const result = await userCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $set: { role: 'admin' } }
        );

        if (result.modifiedCount === 1) {
          res.json({ message: 'User role updated to admin successfully' });
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    
    // connectToMongoDB().then(() => {
    //   app.listen(PORT, () => {
    //     console.log(`Server is running on http://localhost:${PORT}`);
    //   });
    // });
    // Assuming you have created a text index on the relevant fields


// Express route for searching blogs
app.get('/blog', async (req, res) => {
  const search = req.query.search;

  // Ensure search is a string and defined:
  const query = search ? { title: { $regex: search.toString(), $options: 'i' } } : {};

  try {
    const blogs = await blogCollection.find(query).toArray();
    res.send(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving blogs');
  }
});

app.get('/blogs',async (req,res)=>{
  try {
    const blogs = await blogCollection.find().toArray();
    console.log(blogs,'nddjldjsd')
    res.json(blogs);
  } catch (error) {
    console.error('Error retrieving blogs:', error);
    res.status(500).send('Internal Server Error');
  }
})
app.get('/jobs',async (req,res)=>{
  try {
    const blogs = await jobCollection.find().toArray();
    console.log(blogs,'nddjldjsd')
    res.json(blogs);
  } catch (error) {
    console.error('Error retrieving blogs:', error);
    res.status(500).send('Internal Server Error');
  }
})
app.get('/newses',async (req,res)=>{
  try {
    const blogs = await newsCollection.find().toArray();
    console.log(blogs,'nddjldjsd')
    res.json(blogs);
  } catch (error) {
    console.error('Error retrieving blogs:', error);
    res.status(500).send('Internal Server Error');
  }
})
app.delete('/newses/:id', async (req, res) => {
  const blogId = req.params.id;
  console.log('got id',blogId)

  try {
      // Use your MongoDB model to delete the blog by its ID
      const result = await newsCollection.deleteOne({ _id: new ObjectId(blogId) });

      if(result.deletedCount > 0) {
          res.status(200).json({ message: 'Blog deleted successfully' });
      } else {
          res.status(404).json({ message: 'Blog not found' });
      }
  } catch (error) {
      console.error('Error deleting blog:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get('/events',async (req,res)=>{
  try {
    const blogs = await eventCollection.find().toArray();
    console.log(blogs,'nddjldjsd')
    res.json(blogs);
  } catch (error) {
    console.error('Error retrieving blogs:', error);
    res.status(500).send('Internal Server Error');
  }
})
app.delete('/events/:id', async (req, res) => {
  const blogId = req.params.id;
  console.log('got id',blogId)

  try {
      // Use your MongoDB model to delete the blog by its ID
      const result = await eventCollection.deleteOne({ _id: new ObjectId(blogId) });

      if(result.deletedCount > 0) {
          res.status(200).json({ message: 'Blog deleted successfully' });
      } else {
          res.status(404).json({ message: 'Blog not found' });
      }
  } catch (error) {
      console.error('Error deleting blog:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get('/scholar',async (req,res)=>{
  try {
    const blogs = await scholarshipCollection.find().toArray();
    console.log(blogs,'nddjldjsd')
    res.json(blogs);
  } catch (error) {
    console.error('Error retrieving blogs:', error);
    res.status(500).send('Internal Server Error');
  }
})
app.delete('/scholar/:id', async (req, res) => {
  const blogId = req.params.id;
  console.log('got id',blogId)

  try {
      // Use your MongoDB model to delete the blog by its ID
      const result = await scholarshipCollection.deleteOne({ _id: new ObjectId(blogId) });

      if(result.deletedCount > 0) {
          res.status(200).json({ message: 'Blog deleted successfully' });
      } else {
          res.status(404).json({ message: 'Blog not found' });
      }
  } catch (error) {
      console.error('Error deleting blog:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get('/researches',async (req,res)=>{
  try {
    const blogs = await researchPaperCollection.find().toArray();
    console.log(blogs,'nddjldjsd')
    res.json(blogs);
  } catch (error) {
    console.error('Error retrieving blogs:', error);
    res.status(500).send('Internal Server Error');
  }
})
app.delete('/researches/:id', async (req, res) => {
  const blogId = req.params.id;
  console.log('got id',blogId)

  try {
      // Use your MongoDB model to delete the blog by its ID
      const result = await researchPaperCollection.deleteOne({ _id: new ObjectId(blogId) });

      if(result.deletedCount > 0) {
          res.status(200).json({ message: 'Blog deleted successfully' });
      } else {
          res.status(404).json({ message: 'Blog not found' });
      }
  } catch (error) {
      console.error('Error deleting blog:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.delete('/blogs/:id', async (req, res) => {
  const blogId = req.params.id;
  console.log('got id',blogId)

  try {
      // Use your MongoDB model to delete the blog by its ID
      const result = await blogCollection.deleteOne({ _id: new ObjectId(blogId) });

      if(result.deletedCount > 0) {
          res.status(200).json({ message: 'Blog deleted successfully' });
      } else {
          res.status(404).json({ message: 'Blog not found' });
      }
  } catch (error) {
      console.error('Error deleting blog:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.delete('/jobs/:id', async (req, res) => {
  const blogId = req.params.id;
  console.log('got id',blogId)

  try {
      // Use your MongoDB model to delete the blog by its ID
      const result = await jobCollection.deleteOne({ _id: new ObjectId(blogId) });

      if(result.deletedCount > 0) {
          res.status(200).json({ message: 'Blog deleted successfully' });
      } else {
          res.status(404).json({ message: 'Blog not found' });
      }
  } catch (error) {
      console.error('Error deleting blog:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

    // Add this route after your existing routes
// app.get('/blog/:email', async (req, res) => {
//   try {
//     const userEmail = req.params.email;
//     const query = { email: userEmail };
//     const userBlogs = await blogCollection.find(query).toArray();

//     res.json(userBlogs);
//   } catch (error) {
//     console.error('Error fetching user blogs:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

    app.get('/popup', (req, res) => {
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      res.send('Hello from the popup');
    });

    app.get('/news', async (req, res) => {
       
      const search = req.query.search;
      console.log(search);
      const query = { title: { $regex: search, $options: 'i' } };
      const news = await newsCollection.find(query).toArray();
      // console.log(news)
      res.send(news);
    })
    app.get('/news/:nid', async (req, res) => {
      const id = req.params.nid;
      console.log(id); // Check the value of id

      try {
        const blog = await newsCollection.findOne({ _id: ObjectId.isValid(id) ? new ObjectId(id) : id });

        if (!blog) {
          return res.status(404).json({ error: 'Blog not found' });
        }

        // console.log(blog);
        res.json(blog);
      } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    app.get('/admin-stats',async(req,res)=>{
      const blogno=await blogCollection.estimatedDocumentCount();
      const newsno=await newsCollection.estimatedDocumentCount();
      const eventno=await eventCollection.estimatedDocumentCount();
      const scholarshipno=await scholarshipCollection.estimatedDocumentCount();
      const jobsno=await jobCollection.estimatedDocumentCount();
      const researchpaperno=await researchPaperCollection.estimatedDocumentCount();
      res.send({
        blogno,newsno,eventno,scholarshipno,jobsno,researchpaperno
      })
    })
    app.get('/admin-statss', async (req, res) => {
      const userEmail = req.query.email; // Assuming you send the user's email in the query parameter
    
      
        
          try {
          
            const blogs = await blogCollection.find({ email: userEmail }).toArray();
         
            const blogno = blogs.length;
        
 
            const news = await newsCollection.find({ email: userEmail }).toArray();

            const newsno = news.length;
       
            const events = await eventCollection.find({ email: userEmail }).toArray();
       
            const eventno = events.length;
        
         
            const scholarships = await scholarshipCollection.find({ email: userEmail }).toArray();
           
            const scholarshipno = scholarships.length;
        
         
            const jobs = await jobCollection.find({ email: userEmail }).toArray();
           
            const jobsno =jobs.length;
           
            const researchs = await researchPaperCollection.find({ email: userEmail }).toArray();
           
            const researchpaperno= researchs.length;
    
        res.send({
          blogno,newsno, eventno ,scholarshipno,jobsno,researchpaperno
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).send('Error fetching admin stats');
      }
    });
    
    
    app.get('/research', async (req, res) => {
      
      const search = req.query.search;
      console.log(search);
      const query = { title: { $regex: search, $options: 'i' } };
      const research = await researchPaperCollection.find(query).toArray();
      console.log(research)
      res.send(research);
    })
    app.get('/career', async (req, res) => {
     
      const search = req.query.search;
      console.log(search);
      const query = { title: { $regex: search, $options: 'i' } };
      const job = await jobCollection.find(query).toArray();
      // console.log(job)
      res.send(job);
    })
    app.get('/career/:cid', async (req, res) => {
      const id = req.params.cid;
      console.log(id); // Check the value of id

      try {
        const blog = await jobCollection.findOne({ _id: ObjectId.isValid(id) ? new ObjectId(id) : id });

        if (!blog) {
          return res.status(404).json({ error: 'Blog not found' });
        }

        console.log(blog);
        res.json(blog);
      } catch (error) {
        console.error('Error fetching career:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    app.get('/scholarship', async (req, res) => {
      
      const search = req.query.search;
      console.log(search);
      const query = { title: { $regex: search, $options: 'i' } };
      const scholarship = await scholarshipCollection.find(query).toArray();
      console.log(scholarship)
      res.send(scholarship);
    })
    app.get('/scholarship/:sid', async (req, res) => {
      const id = req.params.sid;
      console.log(id); // Check the value of id

      try {
        const blog = await scholarshipCollection.findOne({ _id: ObjectId.isValid(id) ? new ObjectId(id) : id });

        if (!blog) {
          return res.status(404).json({ error: 'Blog not found' });
        }

        // console.log(blog);
        res.json(blog);
      } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    app.get('/event', async (req, res) => {
     
      const search = req.query.search;
      console.log(search);
      const query = { title: { $regex: search, $options: 'i' } };
      const event = await eventCollection.find(query).toArray();
      console.log(event)
      res.send(event);
    })
    app.get('/event/:eid', async (req, res) => {
      const id = req.params.eid;
      console.log(id); // Check the value of id

      try {
        const blog = await eventCollection.findOne({ _id: ObjectId.isValid(id) ? new ObjectId(id) : id });
         console.log('getebr',blog)
        if (!blog) {
          return res.status(404).json({ error: 'Blog not found' });
        }

        console.log('xoss',blog);
        res.json(blog);
      } catch (error) {
        console.error('Error fetching career:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.get('/blog/:bid', async (req, res) => {
      const id = req.params.bid;
      console.log(id); // Check the value of id

      try {
        const blog = await blogCollection.findOne({ _id: ObjectId.isValid(id) ? new ObjectId(id) : id });

        if (!blog) {
          return res.status(404).json({ error: 'Blog not found' });
        }

        console.log(blog);
        res.json(blog);
      } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    
    app.post('/blog', async (req, res) => {
      const { title, description, date, img, email,postedby } = req.body;
      // Here, you can process the received data, save it to a database, or perform any other necessary actions.
      // For this example, we'll just log the received data.
      console.log({ title, description, date, img, email, postedby });
      const post = { title, description, date, img, email,postedby}; // Create an object to insert
      const result = await blogCollection.insertOne(post);
      console.log(result)
      res.json(result);
    });
    app.post('/event', async (req, res) => {
      const { title,
        description,
        date,
        img,
        time,
        location,
        postedby,
        email } = req.body;
      // Here, you can process the received data, save it to a database, or perform any other necessary actions.
      // For this example, we'll just log the received data.
      console.log({ title,
        description,
        date,
        img,
        time,
        location,
        postedby,
        email });
      const post = { title,
        description,
        date,
        img,
        time,
        location,
        postedby,
        email}; // Create an object to insert
      const result = await eventCollection.insertOne(post);
      console.log(result)
      res.json(result);
    });
    app.post('/news', async (req, res) => {
      const { title,
        description,
        date,
        img,
        postedby,
        email } = req.body;
      // Here, you can process the received data, save it to a database, or perform any other necessary actions.
      // For this example, we'll just log the received data.
      console.log({                 title,
        description,
        date,
        img,
        postedby,
        email });
      const post = { title,
        description,
        date,
        img,
        postedby,
        email }; // Create an object to insert
      const result = await newsCollection.insertOne(post);
      console.log(result)
      res.json(result);
    });
    app.post('/scholarship', async (req, res) => {
      const {  title,
        description,
        date,
        img,
        email,
        amount,
        requirement,universityname } = req.body;
      // Here, you can process the received data, save it to a database, or perform any other necessary actions.
      // For this example, we'll just log the received data.
      console.log({ title, description, date, img, email });
      const post = {  title,
        description,
        date,
        img,
        email,
        amount,
        requirement,universityname }; // Create an object to insert
      const result = await scholarshipCollection.insertOne(post);
      console.log(result)
      res.json(result);
    });
    
   

    app.post('/career', async (req, res) => {
      const { title,
        company,
        description,
        date,
        img,
        salary,
        qualification,
        jobresponsibility,
        requiredSkills,
        jobType,
        location,
        link,
        deadline,
        email } = req.body;
      // Here, you can process the received data, save it to a database, or perform any other necessary actions.
      // For this example, we'll just log the received data.
      console.log({ title, description, date, img, email,company });
      const post = {
        title,
        company,
        description,
        date,
        img,
        salary,
        qualification,
        jobresponsibility,
        requiredSkills,
        jobType,
        location,
        link,
        deadline,
        email
      }; // Create an object to insert
      const result = await jobCollection.insertOne(post);
      console.log(result)
      res.json(result);
    });
    app.post('/research', async (req, res) => {
      const {
        title,
        link,
        date,
        img,
        email, postedby } = req.body;
      // Here, you can process the received data, save it to a database, or perform any other necessary actions.
      // For this example, we'll just log the received data.
      console.log({ title, link, date, img, email });
      const post = {
        title,
        link,
        date,
        img,
        email, postedby
      }; // Create an object to insert
      const result = await researchPaperCollection.insertOne(post);
      console.log(result)
      res.json(result);
    });
    app.post('/users', async (req, res) => {
      const user = req.body;
    
      const result = await userCollection.insertOne(user)
      res.send(result);
    })
    
  
    // ...

    // app.get('/blog/:bid', async (req, res) => {
    //     const id = req.params.bid;
    //     console.log(id); // Check the value of id



    //         const query = { _id: new ObjectId(id) };
    //         const blog = await blogCollection.findOne(query);

    //         console.log(blog)

    //         res.json(blog);
    //     } )


    // ...


  }
  finally {

  }
}
run().catch(console.log)


app.get('/', async (req, res) => {
  res.send('campusian is running')
})
app.listen(port, () => console.log(`campusian`))