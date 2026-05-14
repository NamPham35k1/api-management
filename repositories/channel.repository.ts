
import { Channel, IChannel } from '../models/channel.model';

export const createChannel = async (channelData: {
  channelId: string;
  name: string;
  category?: string;
  logo?: string;
  streamUrl: string;
  country?: string;
  language?: string;
  isGlobal?: boolean;
}): Promise<IChannel> => {

  const channel = new Channel(channelData);

  return await channel.save();
};

export const findChannelByChannelId = async (
  channelId: string
): Promise<IChannel | null> => {

  return await Channel.findOne({
    channelId: channelId.toUpperCase()
  });
};

export const findChannelById = async (
  id: string
): Promise<IChannel | null> => {

  return await Channel.findById(id);
};

export const getAllChannels = async (
  limit: number = 50,
  skip: number = 0
): Promise<IChannel[]> => {

  return await Channel.find()
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });
};

export const getChannelsByCategory = async (
  category: string
): Promise<IChannel[]> => {

  return await Channel.find({
    category: category
  });
};

export const searchChannels = async (
  keyword: string
): Promise<IChannel[]> => {

  return await Channel.find({
    name: {
      $regex: keyword,
      $options: 'i'
    }
  });
};

export const updateChannel = async (
  id: string,
  updates: Partial<IChannel>
): Promise<IChannel | null> => {

  return await Channel.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  );
};

export const deleteChannel = async (
  id: string
): Promise<IChannel | null> => {

  return await Channel.findByIdAndDelete(id);
};

export const countChannels = async (): Promise<number> => {
  return await Channel.countDocuments();
};
