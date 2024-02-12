import type { Collection, IDatabaseDriver } from '@mikro-orm/core';
import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken as AdapterVerificationToken
} from '@auth/core/adapters';
import { MikroORM, wrap } from '@mikro-orm/core';

export function MikroOrmAdapter<D extends IDatabaseDriver = IDatabaseDriver>(
  orm: MikroORM<D>,
  options: {
    entities: {
      User: new () => AdapterUser;
      Account: new () => AdapterAccount;
      Session: new () => AdapterSession;
      VerificationToken: new () => AdapterVerificationToken;
    };
  }
): Adapter {
  const UserModel = options.entities.User;
  const AccountModel = options.entities.Account;
  const SessionModel = options.entities.Session;
  const VerificationTokenModel = options.entities.VerificationToken;

  return {
    async createUser(data) {
      const em = orm.em;
      const user = new UserModel();
      wrap(user).assign(data);
      await em.persistAndFlush(user);

      return wrap(user).toObject();
    },

    async getUser(id) {
      const em = orm.em;
      const user = await em.findOne<AdapterUser>(UserModel, { id });
      if (!user) return null;

      return wrap(user).toObject();
    },

    async getUserByEmail(email) {
      const em = orm.em;
      const user = await em.findOne<AdapterUser>(UserModel, { email });
      if (!user) return null;

      return wrap(user).toObject();
    },

    async getUserByAccount(providerAccountId) {
      const em = orm.em;
      const account = await em.findOne<AdapterAccount>(AccountModel, {
        ...providerAccountId
      });
      if (!account) return null;
      const user = await em.findOne<AdapterUser>(UserModel, { id: account.userId });

      return wrap(user).toObject();
    },

    async updateUser(data) {
      const em = orm.em;
      const user = await em.findOne<AdapterUser>(UserModel, { id: data.id });
      if (!user) throw new Error('User not found');
      wrap(user).assign(data, { mergeObjects: true });
      await em.persistAndFlush(user);

      return wrap(user).toObject();
    },

    async deleteUser(id) {
      const em = orm.em;
      const user = await em.findOne<AdapterUser>(UserModel, { id });
      if (!user) return null;
      await em.removeAndFlush(user);

      return wrap(user).toObject();
    },

    async linkAccount(data) {
      const em = orm.em;
      const user = await em.findOne<AdapterUser & { accounts: Collection<AdapterAccount> }>(
        UserModel,
        { id: data.userId }
      );
      if (!user) throw new Error('User not found');
      const account = new AccountModel();
      wrap(account).assign(data);
      user.accounts.add(account);
      await em.persistAndFlush(user);

      return wrap(account).toObject();
    },

    async unlinkAccount(providerAccountId) {
      const em = orm.em;
      const account = await em.findOne<AdapterAccount>(AccountModel, {
        ...providerAccountId
      });
      if (!account) throw new Error('Account not found');
      await em.removeAndFlush(account);

      return wrap(account).toObject();
    },

    async getSessionAndUser(sessionToken) {
      const em = orm.em;
      const session = await em.findOne<AdapterSession & { user: AdapterUser }>(
        SessionModel,
        { sessionToken },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        { populate: ['user'] }
      );
      if (!session || !session.user) return null;

      return {
        user: wrap(session.user).toObject(),
        session: wrap(session).toObject()
      };
    },

    async createSession(data) {
      const em = orm.em;
      const user = await em.findOne(UserModel, { id: data.userId });
      if (!user) throw new Error('User not found');
      const session = new SessionModel();
      wrap(session).assign(data);
      user.sessions.add(session);
      await em.persistAndFlush(user);

      return wrap(session).toObject();
    },

    async updateSession(data) {
      const em = orm.em;
      const session = await em.findOne<AdapterSession>(SessionModel, {
        sessionToken: data.sessionToken
      });
      wrap(session).assign(data);
      if (!session) throw new Error('Session not found');
      await em.persistAndFlush(session);

      return wrap(session).toObject();
    },

    async deleteSession(sessionToken) {
      const em = orm.em;
      const session = await em.findOne<AdapterSession>(SessionModel, {
        sessionToken
      });
      if (!session) return null;
      await em.removeAndFlush(session);

      return wrap(session).toObject();
    },

    async createVerificationToken(data) {
      const em = orm.em;
      const verificationToken = new VerificationTokenModel();
      wrap(verificationToken).assign(data);
      await em.persistAndFlush(verificationToken);

      return wrap(verificationToken).toObject();
    },

    async useVerificationToken(params) {
      const em = orm.em;
      const verificationToken = await em.getRepository(VerificationTokenModel).findOne(params);
      if (!verificationToken) return null;
      await em.removeAndFlush(verificationToken);

      return wrap<AdapterVerificationToken>(verificationToken).toObject();
    }
  };
}
