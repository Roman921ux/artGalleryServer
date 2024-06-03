import ArtModel from '../models/Art.js'



export const updateArt = async (req, res) => {
  try {
    const artId = req.params.id;
    const userId = req.userId;
    const doc = await ArtModel.findById(artId);
    if (doc.user.toString() === userId) {
      const doc = await ArtModel.updateOne({
        _id: artId,
      }, {
        title: req.body.title,
        text: req.body.text,
        user: req.userId
      });
      res.json({
        success: true,
        doc
      });
    } else {
      res.status(500).json({
        message: 'Нельзя менять не свои работы'
      })
    }

  } catch (error) {
    res.status(500).json({
      message: 'Не удалось удалить работу'
    })
  }
}
export const removeArt = async (req, res) => {
  try {
    const artId = req.params.id;
    const userId = req.userId
    const doc = await ArtModel.findById(artId);
    if (!doc) {
      return res.status(404).json({
        message: 'Работа не найдена'
      })
    }
    if (doc.user.toString() === userId) {
      const doc = await ArtModel.findByIdAndDelete(artId)
      return res.json({
        message: 'Работа удалена',
        doc
      })
    } else {
      return res.status(404).json({
        message: 'Вам нельзя удалить не свою работу'
      })
    }

  } catch (error) {
    res.status(500).json({
      message: 'Не удалось удалить работу'
    })
  }
}
export const getOneArt = async (req, res) => {
  try {
    const artId = req.params.id;
    // то что будет в пути после :
    const doc = await ArtModel.findOneAndUpdate(
      { _id: artId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: 'after' }
    )
    // .populate('user').exec();
    if (!doc) {
      return res.status(404).json({
        message: 'Статья не найдена'
      })
    }

    res.json(doc);
  } catch (error) {
    res.status(500).json({
      message: 'Не удалось получить рисунок'
    })
  }
}
export const getAllArt = async (req, res) => {
  try {
    const arts = await ArtModel.find().populate('user').exec();

    res.json(arts);
  } catch (error) {
    res.status(500).json({
      message: 'Не удалось получить рисунки'
    })
  }
}
export const createArt = async (req, res) => {
  try {
    const doc = new ArtModel({
      title: req.body.title,
      text: req.body.text,
      user: req.userId
    });
    // imageUrl: req.body.imageUrl,


    const art = await doc.save();
    res.json(art);
  } catch (error) {
    res.status(500).json({
      message: 'Не удалось создать статью',
      error
    })
  }
}