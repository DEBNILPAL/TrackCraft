import { JsonStorage } from '../storage/jsonStorage';
import { ReferenceLink, UserSanitized, ActivityItem } from '../types';

const linkStorage = new JsonStorage<ReferenceLink>('links');
const activityStorage = new JsonStorage<ActivityItem>('activity');

export class LinkService {
  /**
   * Add a reference link
   */
  static addLink(
    user: UserSanitized,
    projectId: string,
    data: {
      title: string;
      url: string;
      description: string;
      category?: ReferenceLink['category'];
    }
  ): ReferenceLink {
    const trimmedUrl = data.url.trim();

    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      throw new Error('Please enter a valid URL starting with http:// or https://');
    }

    const linkItem: ReferenceLink = {
      id: `link_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId,
      title: data.title.trim(),
      url: trimmedUrl,
      description: data.description.trim(),
      category: data.category || 'Documentation',
      addedBy: user.id,
      addedByName: user.fullName,
      createdAt: new Date().toISOString(),
    };

    linkStorage.insert(linkItem);

    // Log Activity
    activityStorage.insert({
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId,
      userId: user.id,
      userName: user.fullName,
      action: `added reference link: "${data.title.trim()}" (${linkItem.category})`,
      details: data.description,
      createdAt: new Date().toISOString(),
    });

    return linkItem;
  }

  /**
   * Get project reference links
   */
  static getProjectLinks(projectId: string): ReferenceLink[] {
    const links = linkStorage.filter((l) => l.projectId === projectId);
    links.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return links;
  }

  /**
   * Delete link
   */
  static deleteLink(linkId: string): boolean {
    return linkStorage.delete(linkId);
  }
}
