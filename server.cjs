const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto'); 
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importer le package CORS
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();
const port = 8080;
const saltRounds = 10;
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
app.get('/api/parents/', (req, res) => {
  const sql = `
                SELECT 
                      Parent.id AS parent_id,
                      Parent.nom AS parent_nom,
                      Parent.prenom AS parent_prenom
                    FROM Parent`;
  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    res.json(results);
  });
});

// Route to get a parent by ID
app.get('/api/parent/:id', (req, res) => {
  const sql = `SELECT 
                      Parent.id AS parent_id,
                      Parent.username AS parent_username 
                    FROM Parent 
                       WHERE id = ?`;
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
  const query = `
                  SELECT 
                          Eleve.id AS eleve_id,
                          Eleve.username AS eleve_username
                         FROM Eleve 
                          WHERE id = ?`;
  const id = req.params.id;

  db.query(query, [id], (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(results[0]); // Assuming you want to return the first result
    }
  });
});


app.get('/api/eleves/', (req, res) => {
  const sql = `
              SELECT 
                    Eleve.id AS eleve_id,
                    Eleve.nom AS eleve_nom,
                    Eleve.prenom AS eleve_prenom,
                    Eleve.id_classe AS classe_id,
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

app.get('/api/classes/', (req, res) => {
  const sql = `
              SELECT 
                  Classe.nom AS classe_nom, 
                  Classe.id AS classe_id 
              FROM Classe  
  `;
  
  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Aucune classe trouvée' });
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

app.get("/api/classes-eleves/", (req, res) => {
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


app.get("/api/enseignants/", (req, res) => {
  const query =`
                SELECT
                      Enseignant.id AS enseignant_id,
                      Enseignant.nom AS enseignant_nom,
                      Enseignant.prenom AS enseignant_prenom,
                      Enseignant.email AS enseignant_email
                  FROM 
                      Enseignant

                                            `;
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(results); // Assuming you want to return the first result
    }
  });
});


app.get("/api/enseignants-classe/", (req, res) => {
  const query =`
                SELECT 
                      Enseignant_Classe.id AS enseignant_classe_id,
                      Classe.id AS classe_id,
                      Classe.nom AS classe_nom,
                      Enseignant.id AS enseignant_id,
                      Enseignant.nom AS enseignant_nom,
                      Enseignant.prenom AS enseignant_prenom
                  FROM 
                      Enseignant_Classe
                  JOIN Enseignant ON Enseignant.id = Enseignant_Classe.id_enseignant
                  JOIN Classe ON Classe.id = Enseignant_Classe.id_classe

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

// Exemple de route pour récupérer les notes d'un élève par matière et trimestre
app.get('/api/student-grades/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
    // Récupérer les notes d'interrogation
    const interros = await prisma.note_inter.findMany({
      where: { id_eleve: parseInt(studentId) },
      include: {
        matiere: true,
        trimestre: true
      }
    });

    // Récupérer les notes de devoirs
    const devoirs = await prisma.note_devoir.findMany({
      where: { id_eleve: parseInt(studentId) },
      include: {
        matiere: true,
        trimestre: true
      }
    });

    // Organiser les données
    const gradesData = {};

    // Objets pour stocker les compteurs par matière
    const interroCounters = {};
    const devoirCounters = {};

    // Traiter les notes d'interrogation
    interros.forEach(note => {
      const { matiere, trimestre, inter, id } = note;  // Ajouter l'ID de la note d'interrogation
      if (!gradesData[matiere.id]) {
        gradesData[matiere.id] = { name: matiere.matiere, terms: {} };
        // Initialiser les compteurs pour cette matière
        interroCounters[matiere.id] = 1;
        devoirCounters[matiere.id] = 1;
      }
      if (!gradesData[matiere.id].terms[trimestre.id]) {
        gradesData[matiere.id].terms[trimestre.id] = {};
      }
      // Ajouter la note à l'emplacement approprié avec clé incrémentale pour chaque matière
      gradesData[matiere.id].terms[trimestre.id][`interro${interroCounters[matiere.id]++}`] = { grade: inter, id: id };
    });

    // Traiter les notes de devoirs
    devoirs.forEach(note => {
      const { matiere, trimestre, devoir, id } = note;  // Ajouter l'ID de la note de devoir
      if (!gradesData[matiere.id]) {
        gradesData[matiere.id] = { name: matiere.matiere, terms: {} };
        // Initialiser les compteurs pour cette matière
        interroCounters[matiere.id] = 1;
        devoirCounters[matiere.id] = 1;
      }
      if (!gradesData[matiere.id].terms[trimestre.id]) {
        gradesData[matiere.id].terms[trimestre.id] = {};
      }
      // Ajouter la note à l'emplacement approprié avec clé incrémentale pour chaque matière
      gradesData[matiere.id].terms[trimestre.id][`devoir${devoirCounters[matiere.id]++}`] = { grade: devoir, id: id };
    });

    res.json(gradesData);
  } catch (error) {
    console.error('Erreur lors de la récupération des notes:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des notes' });
  }
});


app.get('/api/matieres/', (req, res) => {
  const query = `
    SELECT
      id AS matiere_id,
      matiere AS matiere_nom
    FROM Matiere
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération de la matière:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Matière non trouvée' });
    }

    // Envoyer les données de la matière en réponse
    res.json(results);
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

app.get('/api/trimesters/', (req, res) => {
  const query = `
    SELECT
      id AS trimestre_id,
      nom AS trimestre_nom
    FROM Trimestre
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des trimestres:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Trimestres non trouvée' });
    }

    // Envoyer les données de la matière en réponse
    res.json(results);
  });
});


app.use(express.json());

// Fonction pour générer une chaîne aléatoire
function generateRandomString(length) {
  return crypto.randomBytes(length).toString('hex');
}

app.post('/api/students', async (req, res) => {
  try {
    const { nom, prenom, photo, id_parent, id_classe } = req.body;

    // Validation de la requête
    if (!nom || !prenom || !photo || !id_parent || !id_classe) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Générer un username et un mot de passe aléatoires
    const username = generateRandomString(8); // Par exemple, 8 octets en hexadécimal
    const password = generateRandomString(12); // Par exemple, 12 octets en hexadécimal

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Ajout de l'étudiant dans la base de données avec le mot de passe haché
    const newStudent = await prisma.eleve.create({
      data: {
        nom,
        prenom,
        photo,
        id_parent,
        id_classe,
        username,
        password: hashedPassword
      }
    });

    res.status(201).json({ 
      ...newStudent,
      generatedUsername: username,
      generatedPassword: password
    });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'étudiant' });
  }
});

app.post('/api/enseignants', async (req, res) => {
  try {
    const { nom, prenom, photo, email, id_matiere } = req.body;

    // Validation de la requête
    if (!nom || !prenom || !photo || !email || !id_matiere) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Générer un username et un mot de passe aléatoires
    const username = generateRandomString(8); // Par exemple, 8 octets en hexadécimal
    const password = generateRandomString(12); // Par exemple, 12 octets en hexadécimal

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Ajout de l'enseignant dans la base de données avec le mot de passe haché
    const newEnseignant = await prisma.enseignant.create({
      data: {
        nom,
        prenom,
        photo,
        email,
        id_matiere,
        username,
        password: hashedPassword
      }
    });

    res.status(201).json({ 
      ...newEnseignant,
      generatedUsername: username,
      generatedPassword: password,
    });
  } catch (error) {
    console.error('Error adding enseignant:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'enseignant' });
  }
});

app.post('/api/enseignant-classe', async (req, res) => {
  try {
    const { id_enseignant, id_classe } = req.body;

    // Validation de la requête
    if (!id_enseignant || !id_classe) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    const newEnseignant = await prisma.enseignant_Classe.create({
      data: {
        id_classe,
        id_enseignant,
      }
    });

    res.status(201).json({ 
      ...newEnseignant,
    });
  } catch (error) {
    console.error('Error adding enseignant in the class:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'enseignant dans la classe.' });
  }
});

app.post('/api/classes', async (req, res) => {
  try {
    const { nom } = req.body;

    // Validation de la requête
    if (!nom) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Ajout de l'étudiant dans la base de données avec le mot de passe haché
    const newClass = await prisma.classe.create({
      data: {
        nom,
      }
    });

    res.status(201).json({ 
      ...newClass,
    });
  } catch (error) {
    console.error('Error adding class:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la classe' });
  }
});


// Exemple de route DELETE pour supprimer un élève
app.delete('/api/supprimereleve/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.eleve.delete({
      where: { id: parseInt(id) }
    });
    res.status(200).json({ message: 'Élève supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'élève:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression de l\'élève.' });
  }
});

app.delete('/api/supprimerenseignant/:id/', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.enseignant_Classe.delete({
      where: { id: parseInt(id) }
    });
    res.status(200).json({ message: 'Ensseignant supprimé avec succès de la classe.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'enseignant:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression de l\'enseignant de la classe.' });
  }
});

// Exemple de route DELETE pour supprimer une classe
app.delete('/api/supprimerclasse/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.classe.delete({
      where: { id: parseInt(id) }
    });
    res.status(200).json({ message: 'Classe supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la classe:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression de la classe .' });
  }
});


// Endpoint pour mettre à jour un élève
app.put('/api/miseajoureleve/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, id_classe } = req.body;

  try {
    const updatedEleve = await prisma.eleve.update({
      where: { id: parseInt(id) },
      data: {
        nom,
        prenom,
        id_classe,
      },
    });
    res.json(updatedEleve);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'élève' });
  }
});

// Endpoint pour mettre à jour un enseignant
app.put('/api/miseajourenseignant/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, email } = req.body;

  try {
    const updatedEnseignant = await prisma.enseignant.update({
      where: { id: parseInt(id) },
      data: {
        nom,
        prenom,
        email,
      },
    });
    res.json(updatedEnseignant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'enseignant' });
  }
});

app.put('/api/miseajourinter/:subjectId/:term', async (req, res) => {
  const { subjectId, term } = req.params;
  const { interro1, interro2, interro3, interro4 } = req.body;

  try {
    // Mettre à jour chaque note d'interrogation individuellement
    const updates = [];

    if (interro1 && interro1.id) {
      updates.push(
        prisma.note_inter.update({
          where: { id: interro1.id },
          data: { inter: interro1.grade }
        })
      );
    }

    if (interro2 && interro2.id) {
      updates.push(
        prisma.note_inter.update({
          where: { id: interro2.id },
          data: { inter: interro2.grade }
        })
      );
    }

    if (interro3 && interro3.id) {
      updates.push(
        prisma.note_inter.update({
          where: { id: interro3.id },
          data: { inter: interro3.grade }
        })
      );
    }

    if (interro4 && interro4.id) {
      updates.push(
        prisma.note_inter.update({
          where: { id: interro4.id },
          data: { inter: interro4.grade }
        })
      );
    }

    // Exécuter toutes les mises à jour
    await Promise.all(updates);

    res.status(200).json({ message: 'Notes d\'interrogation mises à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des notes d\'interrogation:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour des notes d\'interrogation' });
  }
});

app.put('/api/miseajourdevoir/:subjectId/:term', async (req, res) => {
  const { subjectId, term } = req.params;
  const { devoir1, devoir2 } = req.body;

  try {
    // Mettre à jour chaque note de devoir individuellement
    const updates = [];

    if (devoir1 && devoir1.id) {
      updates.push(
        prisma.note_devoir.update({
          where: { id: devoir1.id },
          data: { devoir: devoir1.grade }
        })
      );
    }

    if (devoir2 && devoir2.id) {
      updates.push(
        prisma.note_devoir.update({
          where: { id: devoir2.id },
          data: { devoir: devoir2.grade }
        })
      );
    }

    // Exécuter toutes les mises à jour
    await Promise.all(updates);

    res.status(200).json({ message: 'Notes de devoir mises à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des notes de devoir:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour des notes de devoir' });
  }
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
app.post('/api/login/eleve', async (req, res) => {
  const { username, password } = req.body;
  const role = 'eleve';
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
  }

  try {
    // Rechercher l'utilisateur par username et role
    const user = await prisma.eleve.findUnique({
      where: { username },
    });

    if (!user || user.role !== role) {
      return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect.' });
    }

    // Comparer le mot de passe fourni avec le mot de passe haché
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      res.json({ 
        role: user.role,
        userId: user.id
      });
    } else {
      res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect.' });
    }
  } catch (err) {
    console.error('Erreur lors de la connexion', err);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
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











