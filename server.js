const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'desa'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the MySQL server.');
  }
});

app.post('/register', (req, res) => {
  const { username, password, nik } = req.body;
  if (!username || !password || !nik) {
      return res.status(400).json({ message: 'Username, password, and NIK are required' });
  }
  if (nik.length > 16) {
      return res.status(400).json({ message: 'NIK must be 16 digits or less' });
  }
  const query = 'INSERT INTO users (username, password, nik) VALUES (?, ?, ?)';
  db.query(query, [username, password, nik], (err, result) => {
      if (err) {
          console.log('Error inserting user:', err);
          return res.status(500).json({ message: 'Error registering user' });
      }
      res.status(201).json({ message: 'User registered successfully' });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
  }
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
      if (err) {
          console.log('Error querying user:', err);
          return res.status(500).json({ message: 'Error logging in' });
      }
      if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid username or password' });
      }
      res.status(200).json({ message: 'Login successful' });
  });
});

// Endpoint untuk mendapatkan data APB Desa
app.get('/apb_desa', (req, res) => {
    const query = 'SELECT * FROM apb_desa';
    db.query(query, (err, results) => {
        if (err) {
            console.log('Error fetching APB Desa:', err);
            return res.status(500).json({ message: 'Error fetching APB Desa' });
        }
        res.status(200).json(results);
    });
});

// Endpoint untuk mengecek penerima bansos berdasarkan NIK
app.get('/bansos_recipients/:nik', (req, res) => {
    const { nik } = req.params;
    const query = 'SELECT * FROM bansos_recipients WHERE nik = ?';
    db.query(query, [nik], (err, results) => {
        if (err) {
            console.log('Error fetching bansos recipient:', err);
            return res.status(500).json({ message: 'Error fetching bansos recipient' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Recipient not found' });
        }
        res.status(200).json(results[0]);
    });
});

// Endpoint untuk mendapatkan data Development Index
app.get('/development_index', (req, res) => {
    const query = 'SELECT * FROM development_index';
    db.query(query, (err, results) => {
        if (err) {
            console.log('Error fetching Development Index:', err);
            return res.status(500).json({ message: 'Error fetching Development Index' });
        }
        res.status(200).json(results);
    });
});

// Endpoint untuk mendapatkan data Residents
app.get('/residents', (req, res) => {
    const query = 'SELECT * FROM residents';
    db.query(query, (err, results) => {
        if (err) {
            console.log('Error fetching residents:', err);
            return res.status(500).json({ message: 'Error fetching residents' });
        }
        res.status(200).json(results);
    });
});

// Fetch all data
app.get('/apb_desa', (req, res) => {
  db.query('SELECT * FROM apb_desa', (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Database query error' });
    }
    res.json(results);
  });
});

app.get('/bansos_recipients', (req, res) => {
  db.query('SELECT * FROM bansos_recipients', (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Database query error' });
    }
    res.json(results);
  });
});

app.get('/development_index', (req, res) => {
  db.query('SELECT * FROM development_index', (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Database query error' });
    }
    res.json(results);
  });
});

app.get('/residents', (req, res) => {
  db.query('SELECT * FROM residents', (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Database query error' });
    }
    res.json(results);
  });
});

app.get('/sdgs', (req, res) => {
  db.query('SELECT * FROM sdgs', (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Database query error' });
    }
    res.json(results);
  });
});

// Add new data
app.post('/apb_desa', (req, res) => {
  const { year, revenue, expenditure } = req.body;
  db.query('INSERT INTO apb_desa (year, revenue, expenditure) VALUES (?, ?, ?)', [year, revenue, expenditure], (error) => {
    if (error) {
      return res.status(500).json({ message: 'Error adding APB Desa data' });
    }
    res.json({ message: 'APB Desa data added successfully' });
  });
});

app.post('/bansos_recipients', (req, res) => {
  const { resident_id, nik } = req.body;
  db.query('INSERT INTO bansos_recipients (resident_id, nik) VALUES (?, ?)', [resident_id, nik], (error) => {
    if (error) {
      return res.status(500).json({ message: 'Error adding Bansos recipient' });
    }
    res.json({ message: 'Bansos recipient added successfully' });
  });
});

app.post('/development_index', (req, res) => {
  const { year, value } = req.body;
  db.query('INSERT INTO development_index (year, value) VALUES (?, ?)', [year, value], (error) => {
    if (error) {
      return res.status(500).json({ message: 'Error adding Development Index data' });
    }
    res.json({ message: 'Development Index data added successfully' });
  });
});

app.post('/residents', (req, res) => {
  const {id, name, nik, birth_year, status, occupation, education, income, gender, nomor_kk, status_mutasi, jenis_kelamin, status_sementara } = req.body;

  const query = `
    INSERT INTO residents (id,name, nik, birth_year, status, occupation, education, income, gender, nomor_kk, status_mutasi, jenis_kelamin, status_sementara) 
    VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [id,name, nik, birth_year, status, occupation, education, income, gender, nomor_kk, status_mutasi, jenis_kelamin, status_sementara];

  db.query(query, values, (error) => {
    if (error) {
      console.error('Error adding Resident data:', error); // Logging error detail
      return res.status(500).json({ message: 'Error adding Resident data', error: error.message });
    }
    res.json({ message: 'Resident data added successfully' });
  });
});


app.post('/sdgs', (req, res) => {
  const { goal, target, indicator, value, year } = req.body;
  db.query('INSERT INTO sdgs (goal, target, indicator, value, year) VALUES (?, ?, ?, ?, ?)', [goal, target, indicator, value, year], (error) => {
    if (error) {
      return res.status(500).json({ message: 'Error adding SDGs data' });
    }
    res.json({ message: 'SDGs data added successfully' });
  });
});

// Update data
app.put('/apb_desa/:id', (req, res) => {
  const { id } = req.params;
  const { year, revenue, expenditure } = req.body;
  db.query('UPDATE apb_desa SET year = ?, revenue = ?, expenditure = ? WHERE id = ?', [year, revenue, expenditure, id], (error) => {
    if (error) {
      return res.status(500).json({ message: 'Error updating APB Desa data' });
    }
    res.json({ message: 'APB Desa data updated successfully' });
  });
});




app.get('/total-jenis-kelamin', (req, res) => {
  const query = `
      SELECT jenis_kelamin, COUNT(*) as total
      FROM residents
      GROUP BY jenis_kelamin
  `;
  db.query(query, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('Server error');
          return;
      }
      res.json(results);
  });
});

// Endpoint untuk mendapatkan total penduduk berdasarkan nomor KK
app.get('/total-kepala-keluarga', (req, res) => {
  const query = `
      SELECT nomor_kk, COUNT(*) as total
      FROM residents
      GROUP BY nomor_kk
  `;
  db.query(query, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('Server error');
          return;
      }
      res.json(results);
  });
});

// Endpoint untuk mendapatkan total penduduk berdasarkan status mutasi
app.get('/total-mutasi', (req, res) => {
  const query = `
      SELECT status_mutasi, COUNT(*) as total
      FROM residents
      GROUP BY status_mutasi
  `;
  db.query(query, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('Server error');
          return;
      }
      res.json(results);
  });
});

// Endpoint untuk mendapatkan total penduduk sementara
app.get('/total-sementara', (req, res) => {
  const query = `
      SELECT status_sementara, COUNT(*) as total
      FROM residents
      GROUP BY status_sementara
  `;
  db.query(query, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('Server error');
          return;
      }
      res.json(results);
  });
});
app.get('/residents/gender-stats', (req, res) => {
  const query = `
    SELECT jenis_kelamin, COUNT(*) as total
    FROM residents
    GROUP BY jenis_kelamin`;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching gender statistics:', error);
      return res.status(500).json({ message: 'Error fetching gender statistics', error: error.message });
    }
    res.json(results);
  });
});


app.get('/residents/total', (req, res) => {
  const query = 'SELECT COUNT(*) AS total FROM residents';

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error retrieving total residents:', error);
      return res.status(500).json({ message: 'Error retrieving total residents', error: error.message });
    }
    res.json({ total: results[0].total });
  });
});

app.get('/residents/kepala-keluarga', (req, res) => {
  const query = `
    SELECT COUNT(DISTINCT nomor_kk) AS total
    FROM residents
    WHERE nomor_kk IS NOT NULL AND nomor_kk != ''
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error retrieving kepala keluarga:', error);
      return res.status(500).json({ message: 'Error retrieving kepala keluarga', error: error.message });
    }
    res.json({ total: results[0].total });
  });
});
// Define the education categories
const educationCategories = [
  'Tidak Sekolah', 'SD', 'SLTP/Sederajat', 'SLTA/Sederajat', 'Diploma I/II', 
  'Diploma III/Sarjana Muda', 'Diploma IV/Strata I', 'Strata II', 'Strata III'
];

// Define the /residents/education-stats route
app.get('/residents/education-stats', (req, res) => {
  const query = `
    SELECT 
      education,
      COUNT(*) as total
    FROM residents
    GROUP BY education
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching education statistics:', error);
      return res.status(500).json({ message: 'Error fetching education statistics', error: error.message });
    }

    // Ensure all education categories are included
    const stats = educationCategories.map(category => {
      const found = results.find(result => result.education === category);
      return {
        education: category,
        total: found ? found.total : 0
      };
    });

    res.json(stats);
  });
});

// Define the /residents/job-stats route
app.get('/residents/job-stats', (req, res) => {
  const query = `
    SELECT 
      occupation AS job,
      COUNT(*) as total
    FROM residents
    GROUP BY occupation
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching job statistics:', error);
      return res.status(500).json({ message: 'Error fetching job statistics', error: error.message });
    }

    res.json(results);
  });
});

// Define the /residents/religion-stats route
app.get('/residents/religion-stats', (req, res) => {
  const query = `
    SELECT 
      religion AS religious_affiliation,
      COUNT(*) as total
    FROM residents
    GROUP BY religion
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching religion statistics:', error);
      return res.status(500).json({ message: 'Error fetching religion statistics', error: error.message });
    }

    res.json(results);
  });
});

// Route untuk mendapatkan statistik berdasarkan status pernikahan
app.get('/residents/status-stats', (req, res) => {
  const query = `
    SELECT status, COUNT(*) as total
    FROM residents
    GROUP BY status`;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching status statistics:', error);
      return res.status(500).json({ message: 'Error fetching status statistics', error: error.message });
    }
    res.json(results);
  });
});



// Similar endpoints for other tables can be added here

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
