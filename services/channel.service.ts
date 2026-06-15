// services/channel.service.ts

import {
  createChannel,
  findChannelByChannelId,
  getAllChannels,
  getChannelsByCategory,
  searchChannels,
  updateChannel,
  deleteChannel,
  countChannels
} from '../repositories/channel.repository';

import { IChannel } from '../models/channel.model';

export const createNewChannel = async (
  channelData: {
    channelId: string;
    name: string;
    category?: string;
    logo?: string;
    streamUrl: string;
    country?: string;
    language?: string;
    isGlobal?: boolean;
  }
): Promise<IChannel> => {

  const existingChannel = await findChannelByChannelId(
    channelData.channelId
  );

  if (existingChannel) {
    throw new Error('Channel đã tồn tại');
  }

  return await createChannel(channelData);
};

export const getChannels = async (
  limit?: number,
  skip?: number
): Promise<IChannel[]> => {

  return await getAllChannels(limit, skip);
};

export const countChannelsService = async (): Promise<number> => {
  return await countChannels();
};

export const getChannelsByCategoryService = async (
  category: string
): Promise<IChannel[]> => {

  return await getChannelsByCategory(category);
};

export const searchChannelsService = async (
  keyword: string
): Promise<IChannel[]> => {

  return await searchChannels(keyword);
};

export const updateChannelService = async (
  id: string,
  updates: Partial<IChannel>
): Promise<IChannel | null> => {

  return await updateChannel(id, updates);
};

export const deleteChannelService = async (
  id: string
): Promise<IChannel | null> => {

  return await deleteChannel(id);
};
