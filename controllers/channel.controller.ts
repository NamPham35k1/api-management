// controllers/channel.controller.ts

import { Request, Response } from 'express';

import {
  createNewChannel,
  getChannels,
  getChannelsByCategoryService,
  searchChannelsService,
  updateChannelService,
  deleteChannelService
} from '../services/channel.service';

export const createChannel = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const {
      channelId,
      name,
      category,
      logo,
      streamUrl,
      country,
      language
    } = req.body;

    if (!channelId || !name || !streamUrl) {

      res.status(400).json({
        message: 'Thiếu thông tin channel'
      });

      return;
    }

    const channel = await createNewChannel({
      channelId,
      name,
      category,
      logo,
      streamUrl,
      country,
      language
    });

    res.status(201).json({
      message: 'Tạo channel thành công',
      channel
    });

  } catch (error: any) {

    res.status(400).json({
      message: error.message || 'Lỗi server'
    });
  }
};

export const getAllChannelsController = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined;

    const skip = req.query.skip
      ? parseInt(req.query.skip as string)
      : undefined;

    const channels = await getChannels(
      limit,
      skip
    );

    res.status(200).json({
      channels
    });

  } catch (error: any) {

    res.status(500).json({
      message: error.message || 'Lỗi server'
    });
  }
};

export const getChannelsByCategoryController = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const { category } = req.params;

    const channels =
      await getChannelsByCategoryService(category);

    res.status(200).json({
      channels
    });

  } catch (error: any) {

    res.status(500).json({
      message: error.message || 'Lỗi server'
    });
  }
};

export const searchChannelsController = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const keyword = req.query.keyword as string;

    if (!keyword) {

      res.status(400).json({
        message: 'Keyword là bắt buộc'
      });

      return;
    }

    const channels =
      await searchChannelsService(keyword);

    res.status(200).json({
      channels
    });

  } catch (error: any) {

    res.status(500).json({
      message: error.message || 'Lỗi server'
    });
  }
};

export const updateChannelController = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const { id } = req.params;

    const updatedChannel =
      await updateChannelService(
        id,
        req.body
      );

    res.status(200).json({
      message: 'Cập nhật channel thành công',
      updatedChannel
    });

  } catch (error: any) {

    res.status(500).json({
      message: error.message || 'Lỗi server'
    });
  }
};

export const deleteChannelController = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const { id } = req.params;

    await deleteChannelService(id);

    res.status(200).json({
      message: 'Xóa channel thành công'
    });

  } catch (error: any) {

    res.status(500).json({
      message: error.message || 'Lỗi server'
    });
  }
};
