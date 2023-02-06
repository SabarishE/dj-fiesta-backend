"use strict";

/**
 * event controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::event.event", (strapi) => ({
  // Create event by user

  async create(ctx) {
    const user = ctx.state.user;
    let entity;
    ctx.request.body = { data: ctx.request.body };
    ctx.request.body.data.user = ctx.state.user;

    entity = await super.create(ctx);

    const updatedData = await strapi.strapi.entityService.update(
      "api::event.event",
      entity.data.id,
      { data: { user: user.id } }
    );

    return updatedData;
  },

  // Update event by user

  async update(ctx) {
    const user = ctx.state.user;
    const { id } = ctx.params;

    const [events] = await strapi.strapi.entityService.findMany(
      "api::event.event",
      {
        filters: { user: { id: user.id } },
      }
    );

    if (!events) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    ctx.request.body = { data: ctx.request.body };

    ctx.query.filters = {
      ...(ctx.query.filters || {}),
      user: user.id,
    };

    return super.update(ctx);
  },

  // Delete event by user

  async delete(ctx) {
    const user = ctx.state.user;
    const { id } = ctx.params;

    const [events] = await strapi.strapi.entityService.findMany(
      "api::event.event",
      {
        filters: { user: { id: user.id } },
      }
    );

    if (!events) {
      return ctx.unauthorized(`You can't delete this entry`);
    }

    ctx.query.filters = {
      ...(ctx.query.filters || {}),
      user: user.id,
    };

    return super.delete(ctx);
  },

  // Get events of logged in user

  async me(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized("User unauthorized");
    }

    const entity = await strapi.strapi.entityService.findMany(
      "api::event.event",
      {
        filters: { user: { id: user.id } },
      }
    );

    if (!entity) {
      ctx.notFound();
    }

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  },
}));
