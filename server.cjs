const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importer le package CORS
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();
const port = 8080;

// Connect to MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_Memoire'
});

// Middleware to parse JSON requests
app.use(express.json());

app.use(bodyParser.json());

// CORS middleware
app.use(cors());

/****************************************************Parents********************************************************/
// Route to get all parents
app.get('/api/parents', (req, res) => {
  const sql = 'SELECT * FROM Parent';
  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    res.json(results);
  });
});

// Route to get a parent by ID
app.get('/parent/:id', (req, res) => {
  const sql = 'SELECT * FROM Parent WHERE id = ?';
  const id = req.params.id;
  db.query(sql, [id], (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Parent not found' });
    }
    res.json(results[0]);
  });
});

//Recuperer les noms des eleves par parent 

app.get('/api/parent-enfant/:id', (req, res) => {
  const idParent = req.params.id;
  const trimestreId = req.query.trimestre_id;

  const sql = `
    SELECT 
      Eleve.nom AS nom_eleve, 
      Parent.nom AS nom_parent,
      Matiere.matiere AS matiere,
      Note_inter.inter AS note_inter,
      Note_devoir.devoir AS note_devoir,
      Coefficient.coefficient AS coef,
      Trimestre.id AS trimestre_id
    FROM 
      Eleve
    LEFT JOIN 
      Parent ON Parent.id = Eleve.id_parent
    CROSS JOIN
      Matiere
    LEFT JOIN (
      SELECT 
        id_eleve,
        id_matiere,
        inter
      FROM 
        Note_inter
      WHERE 
        id_trimestre = ?
    ) AS Note_inter ON Eleve.id = Note_inter.id_eleve AND Matiere.id = Note_inter.id_matiere
    LEFT JOIN (
      SELECT 
        id_eleve,
        id_matiere,
        devoir
      FROM 
        Note_devoir
      WHERE 
        id_trimestre = ?
    ) AS Note_devoir ON Eleve.id = Note_devoir.id_eleve AND Matiere.id = Note_devoir.id_matiere
    LEFT JOIN 
      Coefficient ON Coefficient.id = Matiere.id_coefficient
    LEFT JOIN 
      Trimestre ON Trimestre.id = ?
    WHERE 
      Parent.id = ?;
  `;

  db.query(sql, [trimestreId, trimestreId, trimestreId, idParent], (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Parent not found' });
    }
    res.json(results);
  });
});



/*********************************************Eleves***********************************************************/
app.get('/api/eleve/:id', (req, res) => {
  const query = 'SELECT * FROM Eleve WHERE id = ?';
  const id = req.params.id;

  db.query(query, [id], (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(results[0]); // Assuming you want to return the first result
    }
  });
});

// Route to get a student by ID
app.get('/api/eleves/', (req, res) => {
  const sql = `
              SELECT 
                    Eleve.nom AS eleve_nom,
                    Eleve.prenom AS eleve_prenom,
                    Classe.nom AS classe_nom
                  FROM
                      Eleve
                  JOIN Classe ON Classe.id = Eleve.id_classe`
                  ;
  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Eleves not found' });
    }
    res.json(results);
  });
});

// Route to get grades for a student by ID
app.get('/api/eleve/:id/notes', (req, res) => {
  const id = req.params.id;
  const trimestreId = req.query.trimestre_id;

  const sql = `
    SELECT 
        Eleve.nom AS nom_eleve, 
        Parent.nom AS nom_parent,
        Matiere.matiere AS matiere,
        NI.inter AS note_inter,
        ND.devoir AS note_devoir,
        Coefficient.coefficient AS coef,
        Trimestre.id AS trimestre_id
    FROM 
        Eleve
    LEFT JOIN 
        Parent ON Parent.id = Eleve.id_parent
    CROSS JOIN
        Matiere
    LEFT JOIN (
        SELECT 
            id_eleve,
            id_matiere,
            inter
        FROM 
            Note_inter
        WHERE 
            id_trimestre = ?
    ) AS NI ON Eleve.id = NI.id_eleve AND Matiere.id = NI.id_matiere
    LEFT JOIN (
        SELECT 
            id_eleve,
            id_matiere,
            devoir
        FROM 
            Note_devoir
        WHERE 
            id_trimestre = ?
    ) AS ND ON Eleve.id = ND.id_eleve AND Matiere.id = ND.id_matiere
    LEFT JOIN 
        Coefficient ON Coefficient.id = Matiere.id_coefficient
    LEFT JOIN 
        Trimestre ON Trimestre.id = ?
    WHERE 
        Eleve.id = ?;
  `;

  db.query(sql, [trimestreId, trimestreId, trimestreId, id], (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Notes not found for this student' });
    }
    res.json(results);
  });
});


app.get('/api/eleves/:id', (req, res) => {
  const id = req.params.id;
  const query = `SELECT 
                    Eleve.id AS eleve_id,
                    Eleve.nom AS eleve_nom,
                    Eleve.prenom AS eleve_prenom,
                    Classe.nom AS eleve_classe
                  FROM Eleve 
                  JOIN Classe ON Eleve.id_classe = Classe.id
                  WHERE Eleve.id_parent = ?`;

  db.query(query, [id], (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(results); // Return all results for children of the parent
    }
  });
});




/**************************************************Enseignant*****************************************************/

// Route to get a enseignant by ID
app.get('/api/enseignant/:id', (req, res) => {
  const sql = 'SELECT * FROM Enseignant WHERE id = ?';
  const id = req.params.id;
  db.query(sql, [id], (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Enseignant not found' });
    }
    res.json(results[0]);
  });
});

app.get('/api/classes/:id', (req, res) => {
  const enseignantId = req.params.id;
  const sql = `
              SELECT 
                  Classe.nom AS classe_nom, 
                  Classe.id AS classe_id 
              FROM Classe 
              INNER JOIN Enseignant_Classe ON Classe.id = Enseignant_Classe.id_classe
              WHERE Enseignant_Classe.id_enseignant = ?;
  `;
  
  db.query(sql, [enseignantId], (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Aucune classe trouvée pour cet enseignant' });
    }
    res.json(results);
  });
});

app.get('/api/notes', (req, res) => {
  const classeId = req.query.classe_id;
  const enseignantId = req.query.enseignant_id;
  const trimestreId = req.query.trimestre_id;

  const sql = `
    SELECT
      Eleve.nom AS eleve_nom,
      Eleve.prenom AS eleve_prenom,
      Eleve.id AS eleve_id,
      Matiere.id_coefficient AS coefficient,
      Matiere.matiere AS matiere_nom,
      Matiere.id AS matiere_id,
      Trimestre.nom AS trimestre_nom,
      Trimestre.id AS trimestre_id,
      GROUP_CONCAT(DISTINCT IF(Note_inter.id_trimestre = ?, Note_inter.inter, NULL)) AS note_interrogation,
      GROUP_CONCAT(DISTINCT IF(Note_devoir.id_trimestre = ?, Note_devoir.devoir, NULL)) AS note_devoir
    FROM 
      Eleve
    JOIN 
      Classe ON Eleve.id_classe = Classe.id
    JOIN 
      Trimestre ON Trimestre.id = ?
    JOIN 
      Enseignant_Classe ON Classe.id = Enseignant_Classe.id_classe
    JOIN 
      Enseignant ON Enseignant_Classe.id_enseignant = Enseignant.id
    JOIN 
      Matiere ON Matiere.id = Enseignant.id_matiere
    LEFT JOIN 
      Note_inter ON Eleve.id = Note_inter.id_eleve AND Note_inter.id_enseignant = Enseignant.id
    LEFT JOIN 
      Note_devoir ON Eleve.id = Note_devoir.id_eleve AND Note_devoir.id_enseignant = Enseignant.id
    WHERE 
      Classe.id = ?
      AND Enseignant.id = ?
    GROUP BY 
      Eleve.id
  `;

  db.query(sql, [trimestreId, trimestreId, trimestreId, classeId, enseignantId], (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Aucune note trouvée pour ce critère' });
    }
    res.json(results);
  });
});


app.post('/api/save-notes', async (req, res) => {
  const notesToSave = req.body;

  try {
    for (const note of notesToSave) {
      // Vérification et enregistrement des notes d'interrogation
      if (note.note_inter1 || note.note_inter2 || note.note_inter3 || note.note_inter4) {
        const existingInter = await prisma.Note_inter.findFirst({
          where: {
            id_eleve: note.id_eleve,
            id_enseignant: parseInt(note.enseignant_id),
            id_matiere: note.matiere_id,
            id_trimestre: note.trimestre_id,
          },
        });

        if (!existingInter) {
          await prisma.Note_inter.create({
            data: {
              eleve: { connect: { id: note.id_eleve } },
              enseignant: { connect: { id: parseInt(note.enseignant_id) } },
              matiere: { connect: { id: note.matiere_id } },
              trimestre: { connect: { id: note.trimestre_id } },
              inter: parseFloat(note.note_inter1),
            },
          });

          // Vous pouvez ajouter des entrées distinctes pour chaque note d'interrogation
          if (note.note_inter2) {
            await prisma.Note_inter.create({
              data: {
                eleve: { connect: { id: note.id_eleve } },
                enseignant: { connect: { id: parseInt(note.enseignant_id) } },
                matiere: { connect: { id: note.matiere_id } },
                trimestre: { connect: { id: note.trimestre_id } },
                inter: parseFloat(note.note_inter2),
              },
            });
          }
          if (note.note_inter3) {
            await prisma.Note_inter.create({
              data: {
                eleve: { connect: { id: note.id_eleve } },
                enseignant: { connect: { id: parseInt(note.enseignant_id) } },
                matiere: { connect: { id: note.matiere_id } },
                trimestre: { connect: { id: note.trimestre_id } },
                inter: parseFloat(note.note_inter3),
              },
            });
          }
          if (note.note_inter4) {
            await prisma.Note_inter.create({
              data: {
                eleve: { connect: { id: note.id_eleve } },
                enseignant: { connect: { id: parseInt(note.enseignant_id) } },
                matiere: { connect: { id: note.matiere_id } },
                trimestre: { connect: { id: note.trimestre_id } },
                inter: parseFloat(note.note_inter4),
              },
            });
          }
        }
      }

      // Vérification et enregistrement des notes de devoir
      if (note.note_devoir1 || note.note_devoir2) {
        const existingDevoir = await prisma.Note_devoir.findFirst({
          where: {
            id_eleve: note.id_eleve,
            id_enseignant: parseInt(note.enseignant_id),
            id_matiere: note.matiere_id,
            id_trimestre: note.trimestre_id,
            devoir: parseFloat(note.note_devoir1)
          },
        });

        if (!existingDevoir) {
          await prisma.Note_devoir.create({
            data: {
              eleve: { connect: { id: note.id_eleve } },
              enseignant: { connect: { id: parseInt(note.enseignant_id) } },
              matiere: { connect: { id: note.matiere_id } },
              trimestre: { connect: { id: note.trimestre_id } },
              devoir: parseFloat(note.note_devoir1),
            },
          });

          if (note.note_devoir2) {
            await prisma.Note_devoir.create({
              data: {
                eleve: { connect: { id: note.id_eleve } },
                enseignant: { connect: { id: parseInt(note.enseignant_id) } },
                matiere: { connect: { id: note.matiere_id } },
                trimestre: { connect: { id: note.trimestre_id } },
                devoir: parseFloat(note.note_devoir2),
              },
            });
          }
        }
      }
    }

    res.status(200).send('Notes enregistrées avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des notes :', error);
    res.status(500).send('Une erreur est survenue lors de l\'enregistrement des notes.');
  } finally {
    await prisma.$disconnect();
  }
});


/**************************************************Administrateur**********************************************/

app.get("/api/classes/", (req, res) => {
  const query =`
                SELECT 
                      Classe.id AS classe_id,
                      Classe.nom AS classe_nom,
                      COUNT(Eleve.id) AS nombre_eleve
                  FROM 
                      Classe
                  LEFT JOIN 
                      Eleve ON Classe.id = Eleve.id_classe
                  GROUP BY 
                      Classe.id, Classe.nom;
                                            `;
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(results); // Assuming you want to return the first result
    }
  });
});

app.get("/api/classe-eleves/:id", (req, res) => {
  const classeId = req.params.id;
  const query =`
              SELECT
                  Eleve.id AS eleve_id,
                  Eleve.nom AS eleve_nom,
                  Eleve.prenom AS eleve_prenom,
                  Eleve.photo AS eleve_photo
                FROM
                  Classe
                JOIN Eleve ON Eleve.id_classe = Classe.id
                WHERE Classe.id = ?
`;
  db.query(query, [classeId], (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(results); // Assuming you want to return the first result
    }
  });
});

app.get('/api/eleves-classe/:id', (req, res) => {
  const id = req.params.id;
  const query = `
                  SELECT
                        Eleve.nom AS eleve_nom,
                        Eleve.prenom AS eleve_prenom,
                        Eleve.photo AS image
                      FROM
                        Eleve
                      WHERE
                        Eleve.id_classe = ?`;
  db.query(query, [id], (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(results); // Assuming you want to return the first result
    }
  });
});

app.get('/api/student-grades/:studentId', (req, res) => {
  const studentId = req.params.studentId;

  const query = `
    SELECT 
    m.id AS matiere_id,
    m.matiere AS matiere_name,
    t.nom AS trimestre_name,
    (CASE WHEN t.id = 1 AND ni.id IS NOT NULL THEN ni.inter  END) AS interro1,
    (CASE WHEN t.id = 1 AND ni.id IS NOT NULL THEN ni.inter  END) AS interro2,
    (CASE WHEN t.id = 1 AND ni.id IS NOT NULL THEN ni.inter  END) AS interro3,
    (CASE WHEN t.id = 1 AND ni.id IS NOT NULL THEN ni.inter  END) AS interro4,
    (CASE WHEN t.id = 1 AND nd.id IS NOT NULL THEN nd.devoir  END) AS devoir1,
    (CASE WHEN t.id = 1 AND nd.id IS NOT NULL THEN nd.devoir  END) AS devoir2,

    (CASE WHEN t.id = 2 AND ni.id IS NOT NULL THEN ni.inter  END) AS interro1,
    (CASE WHEN t.id = 2 AND ni.id IS NOT NULL THEN ni.inter  END) AS interro2,
    (CASE WHEN t.id = 2 AND ni.id IS NOT NULL THEN ni.inter  END) AS interro3,
    (CASE WHEN t.id = 2 AND ni.id IS NOT NULL THEN ni.inter  END) AS interro4,
    (CASE WHEN t.id = 2 AND nd.id IS NOT NULL THEN nd.devoir END) AS devoir1,
    (CASE WHEN t.id = 2 AND nd.id IS NOT NULL THEN nd.devoir END) AS devoir2,
    
    (CASE WHEN t.id = 3 AND ni.id IS NOT NULL THEN nd.devoir  END) AS devoir1,
    (CASE WHEN t.id = 3 AND ni.id IS NOT NULL THEN ni.inter  END) AS interro2,
    (CASE WHEN t.id = 3 AND ni.id IS NOT NULL THEN ni.inter  END) AS interro3,
    (CASE WHEN t.id = 3 AND ni.id IS NOT NULL THEN ni.inter  END) AS interro1,
    (CASE WHEN t.id = 3 AND ni.id IS NOT NULL THEN ni.inter  END) AS interro3,
    (CASE WHEN t.id = 3 AND nd.id IS NOT NULL THEN nd.devoir  END) AS devoir1,
    MAX(CASE WHEN t.id = 3 AND nd.id IS NOT NULL THEN nd.devoir END) AS devoir2
FROM 
    Eleve e
LEFT JOIN 
    Note_inter ni ON ni.id_eleve = e.id
LEFT JOIN 
    Note_devoir nd ON nd.id_eleve = e.id AND nd.id_matiere = ni.id_matiere AND nd.id_trimestre = ni.id_trimestre
LEFT JOIN 
    Matiere m ON ni.id_matiere = m.id OR nd.id_matiere = m.id
LEFT JOIN 
    Trimestre t ON ni.id_trimestre = t.id OR nd.id_trimestre = t.id
WHERE 
    e.id = ?
GROUP BY 
    m.id, t.id
ORDER BY 
    m.id, t.id;

  `;

  db.query(query, [studentId], (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des notes :', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des notes' });
      return;
    }

    // Organiser les résultats dans le format requis
    const formattedResults = results.reduce((acc, row) => {
      const { matiere_id, matiere_name, trimestre_name, interro1, interro2, interro3, interro4, devoir1, devoir2 } = row;

      if (!acc[matiere_id]) {
        acc[matiere_id] = { name: matiere_name, terms: {} };
      }

      if (!acc[matiere_id].terms[trimestre_name]) {
        acc[matiere_id].terms[trimestre_name] = { interro1, interro2, interro3, interro4, devoir1, devoir2 };
      } else {
        acc[matiere_id].terms[trimestre_name] = {
          interro1: acc[matiere_id].terms[trimestre_name].interro1 || interro1,
          interro2: acc[matiere_id].terms[trimestre_name].interro2 || interro2,
          interro3: acc[matiere_id].terms[trimestre_name].interro3 || interro3,
          interro4: acc[matiere_id].terms[trimestre_name].interro4 || interro4,
          devoir1: acc[matiere_id].terms[trimestre_name].devoir1 || devoir1,
          devoir2: acc[matiere_id].terms[trimestre_name].devoir2 || devoir2,
        };
      }

      return acc;
    }, {});

    res.json(formattedResults);
  });
});

app.get('/api/matiere/:matiereId', (req, res) => {
  const { matiereId } = req.params;
  const query = `
    SELECT
      id AS matiere_id,
      matiere AS name
    FROM Matiere
    WHERE id = ?;
  `;

  db.query(query, [matiereId], (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération de la matière:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Matière non trouvée' });
    }

    // Envoyer les données de la matière en réponse
    res.json(results[0]);
  });
});
/*************************************************Connexion*************************************************/



// Connexion à MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connecté à MySQL');
});

// Endpoint pour la connexion

//Endpoint pour la connexion de l'administrateur
app.post('/api/login/admin', (req, res) => {
  const { username, password } = req.body;
  const role = 'admin';
  
  // Requête SQL paramétrée pour éviter les injections SQL
  const query = `SELECT * FROM Admin WHERE username = ? AND password = ? AND role = ?`;
  
  db.query(query, [username, password, role], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des données depuis la base de données', err);
      res.status(500).send('Erreur lors de la récupération des données depuis la base de données');
      return;
    }

    if (results.length > 0) {
      const user = results[0];
      res.json({ 
        role: user.role,
        userId: user.id
       });
    } else {
      res.status(401).send('Nom d\'utilisateur ou mot de passe incorrect.');
    }
  });
});

//Endpoint pour la connexion de l'administrateur
app.post('/api/login/parent', (req, res) => {
  const { username, password } = req.body;
  const role = 'parent';
  
  // Requête SQL paramétrée pour éviter les injections SQL
  const query = 'SELECT * FROM Parent WHERE username = ? AND password = ? AND role = ?';
  
  db.query(query, [username, password, role], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des données depuis la base de données', err);
      res.status(500).send('Erreur lors de la récupération des données depuis la base de données');
      return;
    }

    if (results.length > 0) {
      const user = results[0];
      res.json({ 
        role: user.role,
        userId: user.id
       });
    } else {
      res.status(401).send('Nom d\'utilisateur ou mot de passe incorrect.');
    }
  });
});

//Endpoint pour la connexion de l'enseignant
app.post('/api/login/Enseignant', (req, res) => {
  const { username, password } = req.body;
  const role = 'enseignant';
  
  // Requête SQL paramétrée pour éviter les injections SQL
  const query = 'SELECT * FROM Enseignant WHERE username = ? AND password = ? AND role = ?';
  
  db.query(query, [username, password, role], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des données depuis la base de données', err);
      res.status(500).send('Erreur lors de la récupération des données depuis la base de données');
      return;
    }

    if (results.length > 0) {
      const user = results[0];
      res.json({ 
        role: user.role,
        userId: user.id
       });
    } else {
      res.status(401).send('Nom d\'utilisateur ou mot de passe incorrect.');
    }
  });
});

//Endpoint pour la connexion de l'élève
app.post('/api/login/eleve', (req, res) => {
  const { username, password } = req.body;
  const role = 'eleve';
  
  // Requête SQL paramétrée pour éviter les injections SQL
  const query = 'SELECT * FROM Eleve WHERE username = ? AND password = ? AND role = ?';
  
  db.query(query, [username, password, role], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des données depuis la base de données', err);
      res.status(500).send('Erreur lors de la récupération des données depuis la base de données');
      return;
    }

    if (results.length > 0) {
      const user = results[0];
      res.json({ 
        role: user.role,
        userId: user.id
       });
    } else {
      res.status(401).send('Nom d\'utilisateur ou mot de passe incorrect.');
    }
  });
});


/***************************************************Admin*************************************************/

app.get('/api/admin/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM Admin WHERE id = ?';

  db.query(query, [id], (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(results[0]); // Assuming you want to return the first result
    }
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
