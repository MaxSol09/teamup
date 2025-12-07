import { Ad } from "../models/AdModel.js";
import { Community } from "../models/Community.js";
import {Project} from '../models/ProjectModel.js'


export const createAd = async (req, res) => {
  try {
    const { title, description, theme, tags } = req.body;

    if (!title || !description || !theme) {
      return res.status(400).json({ message: 'Не все обязательные поля заполнены' });
    }

    const ad = await Ad.create({
      title,
      description,
      theme,
      tags: tags || [],
      owner: req.userId,
      isActive: true,
    });

    const populatedAd = await ad.populate('owner', 'name avatar');

    res.json(populatedAd);
  } catch (e) {
  console.error(e);

  res.status(500).json({
    message: 'Ошибка при создании объявления',
    error: e.message,
    stack: e.stack
  });
}
};


export const createProject = async (req, res) => {
  try {
    const { title, description, theme, tags } = req.body;

    if (!title || !description || !theme) {
      return res.status(400).json({
        message: 'Не все обязательные поля заполнены',
      });
    }

    const project = await Project.create({
      title,
      description,
      theme,
      tags: tags || [],
      owner: req.userId
    });

    const populatedProject = await project.populate(
      'owner',
      'name avatar'
    );

    res.json(populatedProject);
  } catch (e) {
    res.status(500).json({
      message: 'Ошибка при создании проекта',
      error: e.message,
    });
  }
};


export const createCommunity = async (req, res) => {
  try {
    const { title, description, theme, tags, isPublic } = req.body;

    if (!title || !description || !theme) {
      return res.status(400).json({
        message: 'Не все обязательные поля заполнены'
      });
    }

    const community = await Community.create({
      title,
      description,
      theme,
      tags: tags || [],
      isPublic: isPublic ?? true,
      owner: req.userId
    });

    const populatedCommunity = await community.populate(
      'owner',
      'name avatar'
    );

    res.status(201).json(populatedCommunity);
  } catch (e) {
    console.error(e);

  res.status(500).json({
    message: 'Ошибка при создании объявления',
    error: e.message,
    stack: e.stack
  });
  }
};

export const getCommunities = async (req, res) => {
  try {
    const communities = await Community.find()
      .populate('owner', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(communities);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: 'Ошибка при получении сообществ'
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('owner', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: 'Ошибка при получении проектов'
    });
  }
};

export const getAds = async (req, res) => {
  try {
    const ads = await Ad.find({ isActive: true })
      .populate('owner', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(ads);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: 'Ошибка при получении объявлений'
    });
  }
};

export const getMyAds = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const ads = await Ad.find({ owner: userId })
      .populate('owner', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(ads);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: 'Ошибка при получении объявлений'
    });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const projects = await Project.find({ owner: userId })
      .populate('owner', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: 'Ошибка при получении проектов'
    });
  }
};

export const getMyCommunities = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const communities = await Community.find({ owner: userId })
      .populate('owner', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(communities);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: 'Ошибка при получении сообществ'
    });
  }
};