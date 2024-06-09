import ArtModel from '../models/Art.js'
import UserModel from '../models/User.js';
import SortModel from '../models/Sort.js'

// User => перенести потом в отдельный контроллер
export const updateFollowerUser = async (req, res) => {
  try {
    const followerId = req.params.id;
    // id пользователя на которого мы хотим подписаться
    const userId = req.userId;

    const doc = await UserModel.findById(followerId);
    // нашли пользователя, на которого хотим подписаться
    if (!doc) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    if (doc.followers.users.includes(userId)) {
      return res.status(400).json({ message: 'Вы уже подписаны на этого пользователя' });
      // заходим в массив подписчиков и пытаемся найти нас, тех кто делает запрос
    }

    const updatedDocFollow = await UserModel.findByIdAndUpdate(
      followerId,
      { $addToSet: { 'followers.users': userId }, $inc: { 'followers.count': 1 } },
      { new: true }
    ).populate([
      { path: 'followers.users' },
      { path: 'arts.items' }
    ]).populate('subscriptions.users');

    // .populate({
    //   path: 'followers.users',
    //   populate: {
    //     path: 'arts.items',
    //   }
    // });
    // если не нашли то можем подписываться*
    const updatedDocSubscriptions = await UserModel.findByIdAndUpdate(
      userId,
      { $addToSet: { 'subscriptions.users': followerId }, $inc: { 'subscriptions.count': 1 } },
      { new: true }
    ).populate({
      path: 'subscriptions.users',
      populate: {
        path: 'arts.items',
      }
    });
    // добавляем себе человека в подписки

    res.json(updatedDocFollow);
  } catch (error) {
    console.error('Ошибка при обновлении подписчика:', error);
    res.status(500).json({
      message: 'Не удалось обновить подписчика'
    });
  }
}
export const updateUnsubUser = async (req, res) => {
  try {
    const followerId = req.params.id;
    // id пользователя от которого мы хотим отписаться
    const userId = req.userId;

    const doc = await UserModel.findById(followerId);
    // нашли пользователя, на которого хотим подписаться
    if (!doc) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    if (!doc.followers.users.includes(userId)) {
      return res.status(400).json({ message: 'Вы еще не подписаны на этого пользователя' });
      // заходим в массив подписчиков и пытаемся найти нас, тех кто делает запрос
    }

    const updatedDocFollow = await UserModel.findByIdAndUpdate(
      followerId,
      { $pull: { 'followers.users': userId }, $inc: { 'followers.count': -1 } },
      { new: true }
    ).populate([
      { path: 'followers.users' },
      { path: 'arts.items' }
    ]).populate('subscriptions.users');
    // .populate({
    //   path: 'followers.users',
    //   populate: {
    //     path: 'arts.items',
    //   }
    // });
    // .populate('followers.users');
    // если не нашли то можем подписываться*
    const updatedDocSubscriptions = await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { 'subscriptions.users': followerId }, $inc: { 'subscriptions.count': -1 } },
      { new: true }
    ).populate({
      path: 'subscriptions.users',
      populate: {
        path: 'arts.items',
      }
    });
    // убираем у себе из подписок человека

    res.json(updatedDocFollow);
  } catch (error) {
    console.error('Ошибка при обновлении подписчика:', error);
    res.status(500).json({
      message: 'Не удалось обновить подписчика'
    });
  }
}
export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const doc = await UserModel.findById(userId).populate([
      { path: 'followers.users' },
      { path: 'arts.items' }
    ]).populate('subscriptions.users');
    if (!doc) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json(doc)
  } catch (error) {
    res.status(500).json({
      message: 'Не удалось найти пользователя',
      error
    });
  }
}
// Sort Rooom
export const createRoom = async (req, res) => {
  try {
    const nameRoom = req.body.nameRoom;

    const doc = new SortModel({
      nameRoom
    });
    const room = await doc.save();
    res.json(room);
  } catch (error) {
    res.status(500).json({
      message: 'Не удалось создать комнату',
      error
    })
  }
}
export const getAllRoom = async (req, res) => {
  try {
    const rooms = await SortModel.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({
      message: 'Не удалось получить комнаты',
      error
    })
  }
}
// Art
export const updateArtLike = async (req, res) => {
  try {
    const userId = req.userId;
    const artId = req.params.id;
    // console.log(artId)

    const art = await ArtModel.findById(artId);
    if (!art) {
      return res.status(404).json({ message: 'Art не найден' });
    }

    if (art.likes.users.includes(userId)) {
      const doc = await ArtModel.findByIdAndUpdate(
        artId,
        { $pull: { 'likes.users': userId }, $inc: { 'likes.count': -1 } },
        { new: true }
      ).populate('user');
      return res.json(doc)
    }
    // если он нашел нас то мы убираем нащ лайк

    const doc = await ArtModel.findByIdAndUpdate(
      artId,
      { $addToSet: { 'likes.users': userId }, $inc: { 'likes.count': 1 } },
      { new: true }
    ).populate('user').populate('likes.users');
    // если он не нашел нас то мы ставим лайк

    res.json(doc)
  } catch (error) {
    res.status(500).json({
      message: 'Не удалось оценить работу'
    })
  }
}
export const updateArtComment = async (req, res) => {
  try {
    const userId = req.userId;
    const artId = req.params.id;
    const comment = req.body.comment;

    const commentObj = {
      userId: userId,
      comment: comment,
      //timestamp: new Date() // Добавление временной метки, если это требуется
    }
    const art = await ArtModel.findByIdAndUpdate(
      artId,
      { $push: { 'comments.commentList': commentObj }, $inc: { 'comments.count': 1 } },
      { new: true }
    ).populate('comments.commentList.userId').populate('likes.users').populate('user');

    if (!art) {
      return res.status(500).json({
        message: 'Не удалось найти работу'
      })
    };

    res.json(art)
  } catch (error) {
    res.status(500).json({
      message: 'Не удалось оставить комментарий'
    })
  }
}
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
    ).populate('user').populate('likes.users').populate('comments.commentList.userId');
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
    const arts = await ArtModel.find().populate('user').populate('likes.users');

    res.json(arts);
  } catch (error) {
    res.status(500).json({
      message: 'Не удалось получить рисунки'
    })
  }
}
export const createArt = async (req, res) => {
  try {
    const userId = req.userId;
    const room = req.body.room;
    const funilyRoom = room.replace(/-/g, ' ')
    // console.log('funilyRoom', funilyRoom)

    const doc = new ArtModel({
      title: req.body.title,
      text: req.body.text,
      user: req.userId,
      room: funilyRoom,
      imageUrl: req.body.image,
    });

    const art = await doc.save();
    const userDoc = await UserModel.findByIdAndUpdate(
      userId,
      { $push: { 'arts.items': art }, $inc: { 'arts.count': 1 } }
    )
    // добавляем art ему в User объект

    const updatedDoc = await SortModel.findOneAndUpdate(
      { nameRoom: { $regex: new RegExp(funilyRoom, 'i') } }, // Условие поиска документа
      { $inc: { countArts: 1 } }, // Обновление поля countArts на 1
      { new: true } // Опция new: true вернет обновленный документ
    );
    // добавляем в комнату нашу работу (счетчик увеличиваем)

    res.json(art);
  } catch (error) {
    res.status(500).json({
      message: 'Не удалось создать статью',
      error
    });
  }
}